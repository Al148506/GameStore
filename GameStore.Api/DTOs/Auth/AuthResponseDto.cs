using GameStore.Api.DTOs.Auth;

namespace GameStore.Api.Dtos.Auth
{
    public class AuthResponseDto
    {
        public string AccessToken { get; set; } = string.Empty;
        public UserWithRolesDto User { get; set; } = null!;
    }
}
