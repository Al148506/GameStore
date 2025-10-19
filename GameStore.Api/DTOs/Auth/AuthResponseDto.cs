namespace GameStore.Api.Dtos.Auth
{
    public class AuthResponseDto
    {
        public string accessToken { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public IEnumerable<string> roles { get; set; } = Enumerable.Empty<string>();
    }
}
