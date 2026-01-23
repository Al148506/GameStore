using GameStore.Infrastructure.Persistence.Videogames.Enums;

namespace GameStore.Infrastructure.Persistence.Videogames.Models
{
    public class DiscountScope
    {
        public Guid Id { get; set; }

        public DiscountTargetType TargetType { get; set; }
        // All | Videogame | Genre | Platform

        public int? TargetId { get; set; }

        // 🔗 FK
        public Guid DiscountId { get; set; }
        public Discount Discount { get; set; }
    }
}
