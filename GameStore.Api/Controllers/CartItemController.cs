// PUT: api/cart/items/{itemId}
using GameStore.Api.Dtos.Cart;
using GameStore.Api.DTOs.Cart;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using GameStore.Infrastructure.Persistence.Videogames;
using AutoMapper;
namespace GameStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]

    public class CartItemController : ControllerBase
    {
        private readonly VideogamesDbContext _context;
        private readonly IMapper _mapper;

        public CartItemController(VideogamesDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

 

        // POST: api/cart/items
        [HttpPost("items")]
        public async Task<ActionResult<CartReadDto>> AddItemToCart([FromBody] CartItemCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var cart = await _context.Carts
                .Include(c => c.Items)
                 .ThenInclude(i => i.Videogame)
                .FirstOrDefaultAsync(c => c.UserId == userId && !c.IsCheckedOut);

            if (cart == null)
                return NotFound("No se encontró un carrito activo.");

            var videogame = await _context.Videogames
                .FirstOrDefaultAsync(v => v.Id == dto.VideogameId);
            if (videogame == null)
                return NotFound("El videojuego especificado no existe.");

            // Verificar si el producto ya está en el carrito
            var existingItem = cart.Items.FirstOrDefault(i => i.VideogameId == dto.VideogameId);
            if (existingItem != null)
            {
                existingItem.Quantity += dto.Quantity;
                existingItem.Total = existingItem.Quantity * existingItem.UnitPrice;
            }
            else
            {
                var newItem = _mapper.Map<CartItem>(dto);
                newItem.CartId = cart.Id;
                newItem.UnitPrice = videogame.Price;
                newItem.Total = newItem.UnitPrice * newItem.Quantity;
                _context.CartItems.Add(newItem);
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var cartReadDto = _mapper.Map<CartReadDto>(cart);
            return Ok(cartReadDto);
        }
        [HttpPut("items/{itemId}")]
        public async Task<IActionResult> UpdateCartItem(int itemId, [FromBody] CartItemUpdateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var cartItem = await _context.CartItems
                .Include(i => i.Cart)
                .FirstOrDefaultAsync(i => i.Id == itemId && i.Cart.UserId == userId && !i.Cart.IsCheckedOut);

            if (cartItem == null)
                return NotFound("No se encontró el producto en el carrito.");

            // Actualizar cantidad y precio total
            cartItem.Quantity = dto.Quantity;
            cartItem.Total = cartItem.Quantity * cartItem.UnitPrice;
            cartItem.Cart.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

     
        // PATCH: api/CartItem/decrease/{itemId}
        [HttpPatch("decrease/{itemId}")]
        public async Task<IActionResult> DecreaseItemQuantity(int itemId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var cartItem = await _context.CartItems
                .Include(i => i.Cart)
                .FirstOrDefaultAsync(i =>
                    i.Id == itemId &&
                    i.Cart.UserId == userId &&
                    !i.Cart.IsCheckedOut);

            if (cartItem == null)
                return NotFound("No se encontró el producto en el carrito.");

            // Disminuir 1 por defecto
            cartItem.Quantity -= 1;

            if (cartItem.Quantity <= 0)
            {
                _context.CartItems.Remove(cartItem);
                cartItem.Cart.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { removed = true });
            }

            // Si solo disminuyó
            cartItem.Total = cartItem.Quantity * cartItem.UnitPrice;
            cartItem.Cart.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                removed = false,
                quantity = cartItem.Quantity,
                total = cartItem.Total
            });
        }



        // DELETE: api/cart/items/{itemId}
        [HttpDelete("items/{itemId}")]
        public async Task<IActionResult> RemoveItemFromCart(int itemId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var item = await _context.CartItems
                .Include(i => i.Cart)
                .FirstOrDefaultAsync(i => i.Id == itemId && i.Cart.UserId == userId && !i.Cart.IsCheckedOut);

            if (item == null)
                return NotFound("No se encontró el producto en el carrito.");

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
