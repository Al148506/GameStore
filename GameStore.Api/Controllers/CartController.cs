using System.Security.Claims;
using AutoMapper;
using GameStore.Api.DTOs.Cart;
using GameStore.Infrastructure.Persistence.Videogames;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Controllers
{
    [ApiController]
    [Route("api/cart")]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly VideogamesDbContext _context;
        private readonly IMapper _mapper;

        public CartController(VideogamesDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/cart/myCart
        [HttpGet("myCart")]
        public async Task<ActionResult<CartReadDto>> GetCartByUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var cart = await _context.Carts
                .Include(c => c.Items)
                    .ThenInclude(i => i.Videogame)
                .FirstOrDefaultAsync(c =>
                    c.UserId == userId && !c.IsCheckedOut);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    IsCheckedOut = false
                };

                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            var cartReadDto = _mapper.Map<CartReadDto>(cart);
            return Ok(cartReadDto);
        }

        // POST: api/cart/checkout
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var cart = await _context.Carts
                    .Include(c => c.Items)
                    .FirstOrDefaultAsync(c =>
                        c.UserId == userId && !c.IsCheckedOut);

                if (cart == null)
                    return NotFound("No se encontró un carrito activo.");

                if (!cart.Items.Any())
                    return BadRequest("El carrito está vacío.");

                // 🔒 Precios congelados desde el carrito
                var order = new Order
                {
                    UserId = userId,
                    CartId = cart.Id,
                    CreatedAt = DateTime.UtcNow,
                    TotalAmount = cart.Items.Sum(i => i.TotalDiscounted),
                    Status = OrderStatus.Paid
                };

                foreach (var item in cart.Items)
                {
                    order.Items.Add(new OrderItem
                    {
                        VideogameId = item.VideogameId,
                        Quantity = item.Quantity,
                        UnitPrice = item.DiscountedUnitPrice
                    });
                }

                _context.Orders.Add(order);

                // Marcar carrito como finalizado
                cart.IsCheckedOut = true;

                // Crear nuevo carrito vacío
                var newCart = new Cart
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    IsCheckedOut = false
                };

                _context.Carts.Add(newCart);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Compra completada exitosamente",
                    orderId = order.Id
                });
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // DELETE: api/cart/clear
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c =>
                    c.UserId == userId && !c.IsCheckedOut);

            if (cart == null)
                return NotFound("No se encontró un carrito activo.");

            if (!cart.Items.Any())
                return NoContent();

            _context.CartItems.RemoveRange(cart.Items);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
