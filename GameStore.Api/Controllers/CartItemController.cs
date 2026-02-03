using System.Security.Claims;
using AutoMapper;
using GameStore.Api.Dtos.Cart;
using GameStore.Api.DTOs.Cart;
using GameStore.Infrastructure.Persistence.Videogames;
using GameStore.Infrastructure.Persistence.Videogames.Interfaces;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Controllers
{
    [ApiController]
    [Route("api/cart")]
    [Authorize]
    public class CartItemController : ControllerBase
    {
        private readonly VideogamesDbContext _context;
        private readonly IMapper _mapper;
        private readonly IDiscountService _discountService;

        public CartItemController(
            VideogamesDbContext context,
            IMapper mapper,
            IDiscountService discountService)
        {
            _context = context;
            _mapper = mapper;
            _discountService = discountService;
        }

        // POST: api/cart/items
        [HttpPost("items")]
        public async Task<ActionResult<CartReadDto>> AddItemToCart(
            [FromBody] CartItemCreateDto dto)
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
                return NotFound("No se encontró un carrito activo.");

            var videogame = await _context.Videogames
                .Include(v => v.Genres)
                .Include(v => v.Platforms)
                .FirstOrDefaultAsync(v => v.Id == dto.VideogameId);

            if (videogame == null)
                return NotFound("El videojuego especificado no existe.");

            var existingItem = cart.Items
                .FirstOrDefault(i => i.VideogameId == dto.VideogameId);

            if (existingItem != null)
            {
                // Solo aumenta cantidad (precio congelado)
                existingItem.Quantity += dto.Quantity;
            }
            else
            {
                var discountedPrice = await _discountService.ApplyDiscountAsync(
                    videogame,
                    videogame.Price,
                    null // cupón a nivel item (opcional)
                );

                var newItem = _mapper.Map<CartItem>(dto);
                newItem.CartId = cart.Id;

                newItem.UnitPrice = videogame.Price;
                newItem.DiscountedUnitPrice = discountedPrice;

                _context.CartItems.Add(newItem);
            }

            cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var cartReadDto = _mapper.Map<CartReadDto>(cart);
            return Ok(cartReadDto);
        }

        // PUT: api/cart/items/{itemId}
        [HttpPut("items/{itemId}")]
        public async Task<IActionResult> UpdateCartItem(
            int itemId,
            [FromBody] CartItemUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

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

            cartItem.Quantity = dto.Quantity;
            cartItem.Cart.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PATCH: api/cart/items/decrease/{itemId}
        [HttpPatch("items/decrease/{itemId}")]
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

            cartItem.Quantity -= 1;

            if (cartItem.Quantity <= 0)
            {
                _context.CartItems.Remove(cartItem);
                cartItem.Cart.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { removed = true });
            }

            cartItem.Cart.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                removed = false,
                quantity = cartItem.Quantity,
                totalOriginal = cartItem.UnitPrice * cartItem.Quantity,
                totalDiscounted = cartItem.DiscountedUnitPrice * cartItem.Quantity
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
                .FirstOrDefaultAsync(i =>
                    i.Id == itemId &&
                    i.Cart.UserId == userId &&
                    !i.Cart.IsCheckedOut);

            if (item == null)
                return NotFound("No se encontró el producto en el carrito.");

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
