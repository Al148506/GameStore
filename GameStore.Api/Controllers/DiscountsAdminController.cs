using AutoMapper;
using AutoMapper.QueryableExtensions;
using GameStore.Api.DTOs.Discounts;
using GameStore.Api.DTOs.Videogames;
using GameStore.Api.Helper;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using GameStore.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace GameStore.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/discounts")]
    [Authorize(Roles = "Admin")]
    public class DiscountsAdminController : ControllerBase
    {
        private readonly DiscountAdminService _service;
        private readonly IMapper _mapper;
        public DiscountsAdminController(DiscountAdminService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(int page = 1, int pageSize = 20)
        {
            var query = _service.GetAll();

            var total = query.Count();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ProjectTo<DiscountListItemDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(new PaginatedResponse<DiscountListItemDto>
            {
                Page = page,
                PageSize = pageSize,
                Total = total,
                Items = items
            });
        }


        [HttpPatch("{id}/toggle")]
        public async Task<IActionResult> Toggle(Guid id)
        {
            await _service.ToggleActiveAsync(id);
            return NoContent();
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody]CreateDiscountRequest request)
        {
            var scopes = request.Scopes.Select(s => new DiscountScope
            {
                Id = Guid.NewGuid(),
                TargetType = s.TargetType,
                TargetId = s.TargetId
            }).ToList();

            Coupon? coupon = null;

            if (request.Coupon != null)
            {
                coupon = new Coupon
                {
                    Id = Guid.NewGuid(),
                    Code = request.Coupon.Code,
                    MaxUses = request.Coupon.MaxUses,
                    UsedCount = 0
                };
            }

            var discountId = await _service.CreateAsync(
                request.Name,
                request.Type,
                request.ValueType,
                request.Value,
                request.StartDate,
                request.EndDate,
                request.IsActive,
                scopes,
                coupon
            );

            return CreatedAtAction(nameof(Create), new { id = discountId });
        }
    }
}
