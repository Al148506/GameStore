using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.DTOs.Auth
{
    public class ChangePasswordRequestDto
    {

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "La nueva contraseña es obligatoria.")]
        public string NewPassword { get; set; } = string.Empty;
    }
}
