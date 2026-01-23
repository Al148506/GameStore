using System.Security.Claims;
using System.Text.Json;
using GameStore.Infrastructure.Persistence.Videogames;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using GameStore.Api.DTOs.Payment;
namespace GameStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly ILogger<PaymentsController> _logger;
        private readonly VideogamesDbContext _context;
        private readonly IConfiguration _config;
        private readonly IWebHostEnvironment _env;
        private readonly DiscountService _discountService = new DiscountService();

        public PaymentsController(
            IConfiguration config,
            VideogamesDbContext context,
            ILogger<PaymentsController> logger,
            IWebHostEnvironment env
        )
        {
            _config = config;
            _context = context;
            _logger = logger;
            _env = env;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> ApplyDiscount(
        ApplyDiscountRequest request)
            {
               
            var finalPrice = await _discountService.ApplyDiscountAsync(
                    request.Videogame,
                    request.Price,
                    request.CouponCode
                );

                return Ok(new { finalPrice });
            }


        [HttpPost("create-payment-link")]
        public async Task<IActionResult> CreatePaymentLink()
        {
            // Obtener ID del usuario logueado (JWT)
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized("No se pudo identificar al usuario.");

            // Obtener carrito
            var cart = await _context
                .Carts.Include(c => c.Items)
                    .ThenInclude(i => i.Videogame)
                .FirstOrDefaultAsync(c => c.UserId == userId && !c.IsCheckedOut);

            if (cart == null || !cart.Items.Any())
                return BadRequest("Tu carrito está vacío.");

            // Convertir carrito a JSON para metadata
            var cartItemsMetadata = cart
                .Items.Select(i => new
                {
                    VideogameId = i.VideogameId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                })
                .ToList();

            var serializedCart = JsonSerializer.Serialize(
                cart.Items.Select(i => new
                {
                    i.VideogameId,
                    i.Quantity,
                    i.UnitPrice,
                })
            );

            // 🔹 Log de depuración de metadata
            _logger.LogInformation(
                "Creando Payment Link con metadata: {@Metadata}",
                new Dictionary<string, string> { { "userId", userId }, { "cart", serializedCart } }
            );
            var successUrl = _config["FrontendUrls:PaymentSuccess"];

            // Crear Payment Link
            var options = new PaymentLinkCreateOptions
            {
                LineItems = cart
                    .Items.Select(item => new PaymentLinkLineItemOptions
                    {
                        PriceData = new PaymentLinkLineItemPriceDataOptions
                        {
                            Currency = "mxn",
                            UnitAmount = (long)(item.UnitPrice * 100),
                            ProductData = new PaymentLinkLineItemPriceDataProductDataOptions
                            {
                                Name = item.Videogame.Name,
                            },
                        },
                        Quantity = item.Quantity,
                    })
                    .ToList(),

                AfterCompletion = new PaymentLinkAfterCompletionOptions
                {
                    Type = "redirect",
                    Redirect = new PaymentLinkAfterCompletionRedirectOptions
                    {
                        Url = successUrl
                    },
                },

                // METADATA que el webhook necesita
                Metadata = new Dictionary<string, string>
                {
                    { "userId", userId },
                    { "cart", serializedCart },
                },
            };

            var service = new PaymentLinkService();
            var link = await service.CreateAsync(options);

            return Ok(new { url = link.Url });
        }
    }
}
