using AutoMapper;
using GameStore.Api.DTOs.Discounts;
using GameStore.Api.Helper;
using GameStore.Infrastructure.Commands.Discounts;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using GameStore.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;

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
        // Validar parámetros
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var query = _service.GetAll();
        var total = await query.CountAsync(); // ✅ Ahora es async

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

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var discount = await _service.GetByIdAsync(id); // ✅ Método específico
        if (discount == null)
            return NotFound(new { message = "Descuento no encontrado" });

        var dto = _mapper.Map<DiscountDetailDto>(discount);
        return Ok(dto);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDiscountRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
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

            return CreatedAtAction(nameof(GetById), new { id = discountId }, new { id = discountId });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateDiscountRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var command = new UpdateDiscountCommand
            {
                Name = request.Name,
                Type = request.Type,
                ValueType = request.ValueType,
                Value = request.Value,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                IsActive = request.IsActive,
                Scopes = request.Scopes.Select(s => new UpdateDiscountScopeCommand
                {
                    Id = s.Id,
                    TargetType = s.TargetType,
                    TargetId = s.TargetId
                }).ToList(),
                Coupon = request.Coupon == null
                    ? null
                    : new UpdateCouponCommand
                    {
                        Id = request.Coupon.Id,
                        Code = request.Coupon.Code,
                        MaxUses = request.Coupon.MaxUses
                    }
            };

            await _service.UpdateAsync(id, command);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Descuento no encontrado" });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPatch("{id}/toggle")]
    public async Task<IActionResult> Toggle(Guid id)
    {
        try
        {
            await _service.ToggleActiveAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Descuento no encontrado" });
        }
    }
}