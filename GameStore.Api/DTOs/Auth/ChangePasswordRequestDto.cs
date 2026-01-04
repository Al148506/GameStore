using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.DTOs.Auth
{
    public class ChangePasswordRequestDto
    {

        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "La nueva contraseña es obligatoria.")]
        [StringLength(50, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
        public string NewPassword { get; set; } = string.Empty;
    }
}
