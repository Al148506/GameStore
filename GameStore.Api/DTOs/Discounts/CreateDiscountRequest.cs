using GameStore.Infrastructure.Persistence.Videogames.Enums;

namespace GameStore.Api.DTOs.Discounts
{
    public class CreateDiscountRequest
    {
        public string Name { get; set; }
        public DiscountType Type { get; set; }
        public DiscountValueType ValueType { get; set; }
        public decimal Value { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; }

        public List<DiscountScopeDto> Scopes { get; set; } = new();
        public CreateCouponDto? Coupon { get; set; }
    }
}
