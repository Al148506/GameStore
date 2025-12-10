using AutoMapper;
using GameStore.Api.Dtos.Cart;
using GameStore.Api.DTOs.Cart;
using GameStore.Infrastructure.Persistence.Videogames;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GameStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // ✅ Requiere autenticación
    public class CartController : ControllerBase
    {
        private readonly VideogamesDbContext _context;
        private readonly IMapper _mapper;

        public CartController(VideogamesDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("myCart")]
        public async Task<ActionResult<CartReadDto>> GetCartByUser()

        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var cart = await _context.Carts
                .Include(c => c.Items)
                 .ThenInclude(i => i.Videogame)
                .FirstOrDefaultAsync(c => c.UserId == userId && !c.IsCheckedOut);

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


        [HttpPost]
        public async Task<ActionResult<CartReadDto>> CreateCart([FromBody] CartCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();
            // ✅ Validar que tenga al menos un producto
            if (dto.Items == null || dto.Items.Count == 0)
                return BadRequest("El carrito debe tener al menos un producto.");

            // Evitar carrito duplicado
            var existingCart = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && !c.IsCheckedOut);
            if (existingCart != null)
                return BadRequest("Ya tienes un carrito activo. Finaliza la compra antes de crear otro.");


            var cart = _mapper.Map<Cart>(dto);
            cart.UserId = userId;

            foreach (var item in cart.Items)
            {
                var game = await _context.Videogames.FindAsync(item.VideogameId);
                if (game == null)
                    return BadRequest($"El videojuego con id {item.VideogameId} no existe.");

                item.UnitPrice = game.Price;
                item.Total = game.Price * item.Quantity;
            }


            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
            var cartReadDto = _mapper.Map<CartReadDto>(cart);
            return CreatedAtAction(nameof(GetCartByUser), new { id = cart.Id }, cartReadDto);
        }
        // Actualiza el estado del carrito completo (por ejemplo, marcar como pagado)
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
                .ThenInclude(i => i.Videogame)
                .FirstOrDefaultAsync(c => c.UserId == userId && !c.IsCheckedOut);

                if (cart == null)
                    return NotFound("No se encontró un carrito activo.");

                if (!cart.Items.Any())
                    return BadRequest("El carrito está vacío.");

                // Crear pedido
                var order = new Order
                {

                    UserId = userId,
                    CartId = cart.Id,
                    CreatedAt = DateTime.UtcNow,
                    TotalAmount = cart.Items.Sum(i => i.Quantity * i.Videogame.Price),
                    Status = OrderStatus.Paid
                };

                foreach (var item in cart.Items)
                {
                    order.Items.Add(new OrderItem
                    {
                        VideogameId = item.VideogameId,
                        Quantity = item.Quantity,
                        UnitPrice = item.Videogame.Price
                    });
                }
                _context.Orders.Add(order);
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

                return Ok(new { message = "Compra completada exitosamente", orderId = order.Id });
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

            //Remover todos los items dentro del carrito activo del usuario
            [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var cart = await _context.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId && !c.IsCheckedOut);

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
