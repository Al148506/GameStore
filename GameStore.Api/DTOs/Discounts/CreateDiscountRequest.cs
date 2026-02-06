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

        [Required(ErrorMessage = "La fecha de inicio es obligatoria")]
        public DateTime? StartDate { get; set; }

        [Required(ErrorMessage = "La fecha de fin es obligatoria")]
        public DateTime? EndDate { get; set; }

        [CustomValidation(typeof(CreateDiscountRequest), nameof(ValidateDates))]
        public CreateDiscountRequest Self => this;

        public static ValidationResult? ValidateDates(
            CreateDiscountRequest request,
            ValidationContext context)
        {
            if (request.StartDate.HasValue &&
                request.EndDate.HasValue &&
                request.EndDate < request.StartDate)
            {
                return new ValidationResult(
                    "La fecha de fin no puede ser anterior a la fecha de inicio",
                    new[] { nameof(EndDate) }
                );
            }

            return ValidationResult.Success;
        }


        public bool IsActive { get; set; }

        [Required(ErrorMessage = "Debe especificar al menos un scope")]
        public List<DiscountScopeDto> Scopes { get; set; }
        public CouponDto? Coupon { get; set; }
    }
}
