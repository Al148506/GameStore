using GameStore.Infrastructure.Persistence.Videogames.Enums;
using GameStore.Infrastructure.Persistence.Videogames.Interfaces;
using GameStore.Infrastructure.Persistence.Videogames.Models;

namespace GameStore.Infrastructure.Services
{
    public class DiscountAdminService
    {
        private readonly IDiscountRepository _discountRepository;

        public DiscountAdminService(IDiscountRepository discountRepository)
        {
            _discountRepository = discountRepository;
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
    }
}
