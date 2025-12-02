using GameStore.Infrastructure.Persistence.Videogames;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Microsoft.EntityFrameworkCore;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using GameStore.Api.DTOs.Order;
using System.Text.Json;

namespace GameStore.Api.Controllers
{
    [ApiController]
    [Route("api/webhooks/stripe")]
    public class WebhookController : ControllerBase
    {
        private readonly VideogamesDbContext _context;
        private readonly IConfiguration _config;
        private readonly ILogger<WebhookController> _logger;

        public WebhookController(
            VideogamesDbContext context,
            IConfiguration config,
            ILogger<WebhookController> logger)
        {
            _context = context;
            _config = config;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Handle()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var webhookSecret = _config["Stripe:WebhookSecret"];

            Event stripeEvent;
            try
            {
                stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    webhookSecret
                );
            }
            catch (Exception ex)
            {
                _logger.LogError("❌ Firma inválida: {Message}", ex.Message);
                return BadRequest($"Invalid signature: {ex.Message}");
            }

            _logger.LogInformation("🔥 Evento Stripe recibido: {EventType}", stripeEvent.Type);

            if (stripeEvent.Type == "checkout.session.completed")
            {
                var session = stripeEvent.Data.Object as Stripe.Checkout.Session;
                if (session == null)
                {
                    _logger.LogError("❌ Checkout Session inválida");
                    return BadRequest("Checkout Session inválida.");
                }

                _logger.LogInformation("📌 Metadata recibida: {@Metadata}", session.Metadata);

                var userId = session.Metadata.ContainsKey("userId") ? session.Metadata["userId"] : null;
                var cartJson = session.Metadata.ContainsKey("cart") ? session.Metadata["cart"] : null;

                if (userId == null || cartJson == null)
                {
                    _logger.LogError("❌ Metadata incompleta");
                    return BadRequest("Metadata incompleta.");
                }

                var items = JsonSerializer.Deserialize<List<OrderItemDto>>(cartJson);

                _logger.LogInformation("🛒 Items deserializados: {@Items}", items);
                var cart = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && !c.IsCheckedOut);


                var order = new Order
                {
                    UserId = userId,
                    CartId = cart?.Id ?? 0,
                    CreatedAt = DateTime.UtcNow,
                    TotalAmount = items.Sum(i => i.UnitPrice * i.Quantity),
                    Items = items.Select(i => new OrderItem
                    {
                        VideogameId = i.VideogameId,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice
                    }).ToList()
                };

                _context.Orders.Add(order);

                // 🟦 Marcar carrito como checkout en vez de vaciarlo


                if (cart != null)
                {
                    cart.IsCheckedOut = true;

                    // Crear nuevo carrito vacío
                    _context.Carts.Add(new Cart
                    {
                        UserId = userId,
                        CreatedAt = DateTime.UtcNow,
                        IsCheckedOut = false
                    });
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation("✅ Orden creada correctamente");
            }
            else
            {
                _logger.LogWarning("⚠ Evento ignorado: {EventType}", stripeEvent.Type);
            }

            return Ok();
        }

    }
}
