using GameStore.Infrastructure.Persistence.Videogames.Enums;
using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.DTOs.Discounts
{
    public class CreateDiscountRequest
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 200 caracteres")]
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
        public List<DiscountScopeDto> Scopes { get; set; }
        public CouponDto? Coupon { get; set; }
    }
}
