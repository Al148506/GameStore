using AutoMapper;
using GameStore.Api.DTOs.Order;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using GameStore.Infrastructure.Persistence.Videogames;
using Microsoft.EntityFrameworkCore;
namespace GameStore.Api.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly VideogamesDbContext _context;
        private readonly IMapper _mapper;

        public OrderController(VideogamesDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // Historial de pedidos del usuario logueado
        [HttpGet("history")]
        public async Task<IActionResult> GetOrderHistory()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var orders = await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Videogame)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            var dto = _mapper.Map<List<OrderDto>>(orders);
            return Ok(dto);
        }

        // Obtener detalle de un pedido
        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrder(int orderId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var order = await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Videogame)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null) return NotFound();

            return Ok(_mapper.Map<OrderDto>(order));
        }

        [HttpGet("last-order")]
        public async Task<IActionResult> GetLastOrder()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();
            var order = await _context.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Videogame)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync();
            if (order == null) return NotFound();
            return Ok(_mapper.Map<OrderDto>(order));
        }

    }
}
