using GameStore.Infrastructure.Persistence.Videogames.Enums;

namespace GameStore.Infrastructure.Persistence.Videogames.Models
{
    public class Discount
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public DiscountType Type { get; set; }
        public DiscountValueType ValueType { get; set; }

        public decimal Value { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public bool IsActive { get; set; }

        // 🔗 Relaciones
        public ICollection<DiscountScope> DiscountScopes { get; set; }
            = new List<DiscountScope>();

        public Coupon? Coupon { get; set; }
    }
}

