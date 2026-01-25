using GameStore.Infrastructure.Persistence.Videogames.Enums;

namespace GameStore.Api.DTOs.Discounts
{
    public class DiscountScopeDto
    {
        public DiscountTargetType TargetType { get; set; }
        public int? TargetId { get; set; }
    }
}
