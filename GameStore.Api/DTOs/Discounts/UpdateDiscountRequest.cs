using GameStore.Infrastructure.Persistence.Videogames.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GameStore.Api.DTOs.Discounts
{
    public class UpdateDiscountRequest
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(200, MinimumLength = 3)]
        public string Name { get; set; }

        [Required]
        public DiscountType Type { get; set; }

        [Required]
        public DiscountValueType ValueType { get; set; }

        [Range(0, 100, ErrorMessage = "El valor debe estar entre 0 y 100")]
        public decimal Value { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; }

        [Required(ErrorMessage = "Debe especificar al menos un scope")]
        [MinLength(1, ErrorMessage = "Debe tener al menos un scope")] // ⬅️ CRÍTICO
        public List<DiscountScopeDto> DiscountScopes { get; set; } = new();

        public CouponDto? Coupon { get; set; }
    }
}
