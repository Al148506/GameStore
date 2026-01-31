using GameStore.Infrastructure.Persistence.Videogames.Enums;
using GameStore.Infrastructure.Persistence.Videogames.Interfaces;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using GameStore.Infrastructure.Commands.Discounts;
using Microsoft.EntityFrameworkCore;
using GameStore.Infrastructure.Persistence.Videogames;


namespace GameStore.Infrastructure.Services
{
    public class DiscountAdminService 
    {
        private readonly IDiscountRepository _discountRepository;
        private readonly VideogamesDbContext _context;

        public DiscountAdminService(IDiscountRepository discountRepository, VideogamesDbContext context)
        {
            _discountRepository = discountRepository;
            _context = context;
        }

        public async Task<Guid> CreateAsync(
            string name,
            DiscountType type,
            DiscountValueType valueType,
            decimal value,
            DateTime start,
            DateTime end,
            bool isActive,
            List<DiscountScope> scopes,
            Coupon? coupon)
        {
            // ✅ VALIDACIONES
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("El nombre es obligatorio");

            if (value < 0)
                throw new ArgumentException("El valor no puede ser negativo");

            if (end < start)
                throw new ArgumentException("La fecha de fin debe ser posterior a la de inicio");

            if (scopes == null || scopes.Count == 0)
                throw new ArgumentException("El descuento debe tener al menos un scope"); // ⬅️ CRÍTICO

            var discount = new Discount
            {
                Id = Guid.NewGuid(),
                Name = name,
                Type = type,
                ValueType = valueType,
                Value = value,
                StartDate = start,
                EndDate = end,
                IsActive = isActive,
                DiscountScopes = scopes,
                Coupon = coupon
            };

            await _discountRepository.AddAsync(discount);
            return discount.Id;
        }



        public IQueryable<Discount> GetAll()
        {
            return  _discountRepository.GetAll();
        }

        public async Task<Discount?> GetByIdAsync(Guid id)
        {
            return await _discountRepository.GetByIdAsync(id);
        }

        public async Task ToggleActiveAsync(Guid id)
        {
            var discount = await _discountRepository.GetByIdAsync(id);
            if (discount == null)
            {
                throw new KeyNotFoundException("Discount not found.");
            }
            discount.IsActive = !discount.IsActive;
            await _discountRepository.UpdateAsync(discount);
        }

        public async Task UpdateAsync(Guid id, UpdateDiscountCommand request)
        {
            // Validaciones
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ArgumentException("El nombre es obligatorio");

            if (request.Value < 0)
                throw new ArgumentException("El valor no puede ser negativo");

            if (request.EndDate < request.StartDate)
                throw new ArgumentException("La fecha de fin debe ser posterior a la de inicio");

            if (request.Scopes == null || request.Scopes.Count == 0)
                throw new ArgumentException("El descuento debe tener al menos un scope"); // ⬅️ CRÍTICO

            var discount = await _discountRepository.GetByIdAsync(id);
            if (discount == null)
                throw new KeyNotFoundException("Discount not found.");


            discount.Name = request.Name;
            discount.Type = request.Type;
            discount.ValueType = request.ValueType;
            discount.Value = request.Value;
            discount.StartDate = request.StartDate;
            discount.EndDate = request.EndDate;
            discount.IsActive = request.IsActive;

            await SyncScopesAsync(discount, request.Scopes); 
            await SyncCouponAsync(discount, request.Coupon);

            await _discountRepository.UpdateAsync(discount);
        }


        private async Task SyncScopesAsync(
       Discount discount,
       List<UpdateDiscountScopeCommand> requestScopes)
        {
            if (requestScopes == null || requestScopes.Count == 0)
            {
                discount.DiscountScopes.Clear();
                return;
            }

            // 1️⃣ Obtener IDs de scopes existentes en la BD
            var existingScopeIds = await _context.DiscountScopes
                .Where(ds => ds.DiscountId == discount.Id)
                .Select(ds => ds.Id)
                .ToListAsync();

            var requestIds = requestScopes
                .Where(rs => rs.Id != Guid.Empty)
                .Select(rs => rs.Id)
                .ToHashSet();

            // 2️⃣ Eliminar scopes que ya no vienen
            var toRemove = discount.DiscountScopes
                .Where(ds => !requestIds.Contains(ds.Id))
                .ToList();

            foreach (var scope in toRemove)
            {
                discount.DiscountScopes.Remove(scope);
            }

            // 3️⃣ Actualizar o agregar
            foreach (var req in requestScopes)
            {
                if (req.Id == Guid.Empty) // Nuevo
                {
                    discount.DiscountScopes.Add(new DiscountScope
                    {
                        Id = Guid.NewGuid(),
                        DiscountId = discount.Id,
                        TargetType = req.TargetType,
                        TargetId = req.TargetId
                    });
                }
                else if (existingScopeIds.Contains(req.Id)) // ✅ Verificar contra la BD
                {
                    var existing = discount.DiscountScopes
                        .FirstOrDefault(ds => ds.Id == req.Id);

                    if (existing != null)
                    {
                        existing.TargetType = req.TargetType;
                        existing.TargetId = req.TargetId;
                    }
                }
                else
                {
                    throw new InvalidOperationException(
                        $"DiscountScope con ID {req.Id} no existe en la base de datos");
                }
            }
        }

        private async Task SyncCouponAsync(Discount discount, UpdateCouponCommand requestCoupon)
        {
            if (requestCoupon == null)
            {
                discount.Coupon = null;
                return;
            }

            // ✅ Validar código único
            Guid? currentCouponId = discount.Coupon != null ? discount.Coupon.Id : (Guid?)null;
            var existingCoupon = await _context.Coupons
                .FirstOrDefaultAsync(c => c.Code == requestCoupon.Code && (currentCouponId == null || c.Id != currentCouponId.Value));

            if (existingCoupon != null)
                throw new InvalidOperationException($"El código '{requestCoupon.Code}' ya existe");

            if (discount.Coupon == null)
            {
                discount.Coupon = new Coupon
                {
                    Id = Guid.NewGuid(),
                    DiscountId = discount.Id,
                    Code = requestCoupon.Code,
                    MaxUses = requestCoupon.MaxUses
                };
            }
            else
            {
                discount.Coupon.Code = requestCoupon.Code;
                discount.Coupon.MaxUses = requestCoupon.MaxUses;
            }
        }


    }
}
