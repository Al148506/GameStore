using GameStore.Api.DTOs.Discounts;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using GameStore.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GameStore.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/discounts")]
    [Authorize(Roles = "Admin")]
    public class DiscountsAdminController : ControllerBase
    {
        private readonly DiscountAdminService _service;

        public DiscountsAdminController(DiscountAdminService service)
        {
            _service = service;
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
