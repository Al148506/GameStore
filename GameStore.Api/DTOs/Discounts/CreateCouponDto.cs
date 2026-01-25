namespace GameStore.Api.DTOs.Discounts
{
    public class CreateCouponDto
    {
        public string Code { get; set; }
        public int? MaxUses { get; set; }
    }
}
