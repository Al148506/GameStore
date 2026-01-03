using System.Security.Claims;
using AutoMapper;
using GameStore.Api.DTOs.Order;
using GameStore.Api.DTOs.Videogames;
using GameStore.Api.Helper;
using GameStore.Infrastructure.Persistence.Videogames;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> GetOrderHistory(
            int page = 1,
            int pageSize = 5,
            string? sort = "date_desc"
        )
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var query = _context
                .Orders.Include(o => o.Items)
                    .ThenInclude(i => i.Videogame)
                .Where(o => o.UserId == userId)
                .AsQueryable();

            query = sort switch
            {
                "date_asc" => query.OrderBy(o => o.CreatedAt),
                "date_desc" => query.OrderByDescending(o => o.CreatedAt),

                "total_asc" => query.OrderBy(o => o.TotalAmount),
                "total_desc" => query.OrderByDescending(o => o.TotalAmount),

                _ => query.OrderByDescending(o => o.CreatedAt),
            };
            var totalRecords = await query.CountAsync();

            var total = await query.CountAsync();

            var orders = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            var items = _mapper.Map<List<OrderDto>>(orders);

            return Ok(
                new PaginatedResponse<OrderDto>
                {
                    Page = page,
                    PageSize = pageSize,
                    Total = total,
                    Items = items,
                }
            );
        }

        // Obtener detalle de un pedido
        [HttpGet("{orderId}")]
        public async Task<IActionResult> GetOrder(int orderId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var order = await _context
                .Orders.Include(o => o.Items)
                    .ThenInclude(i => i.Videogame)
                .FirstOrDefaultAsync(o => o.Id == orderId && o.UserId == userId);

            if (order == null)
                return NotFound();

            return Ok(_mapper.Map<OrderDto>(order));
        }

        [HttpGet("last-order")]
        public async Task<IActionResult> GetLastOrder()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();
            var order = await _context
                .Orders.Include(o => o.Items)
                    .ThenInclude(i => i.Videogame)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync();
            if (order == null)
                return NotFound();
            return Ok(_mapper.Map<OrderDto>(order));
        }
    }
}
