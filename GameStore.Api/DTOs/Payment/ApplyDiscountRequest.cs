using GameStore.Infrastructure.Persistence.Videogames;

namespace GameStore.Api.DTOs.Payment
{
    public class ApplyDiscountRequest
    {
        public Videogame Videogame { get; set; }
        public decimal Price { get; set; }
        public string? CouponCode { get; set; }
    }
}
