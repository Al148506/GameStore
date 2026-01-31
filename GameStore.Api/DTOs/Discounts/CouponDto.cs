namespace GameStore.Api.DTOs.Discounts
{
    public class CouponDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public int? MaxUses { get; set; }

        public int UsedCount { get; set; } = 0;
    }
}
