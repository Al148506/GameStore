namespace GameStore.Api.DTOs.Discounts
{
    public class DiscountDetailDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string ValueType { get; set; }
        public decimal Value { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
        public CouponDto? Coupon { get; set; } // Objeto completo

        public List<DiscountScopeDto> DiscountScopes { get; set; }
    }
}
