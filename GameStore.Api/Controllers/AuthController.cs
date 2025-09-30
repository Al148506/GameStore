using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GameStore.Infrastructure.Persistence.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace GameStore.Api.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _users;
        private readonly SignInManager<ApplicationUser> _signIn;
        private readonly IConfiguration _cfg;
        public AuthController(UserManager<ApplicationUser> users, SignInManager<ApplicationUser> signIn, IConfiguration cfg)
        {
            _users = users; _signIn = signIn; _cfg = cfg;
        }
        public record RegisterRequest(string Email, string Password);
        public record LoginRequest(string Email, string Password);
        public record AuthResponse(string AccessToken);
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest req)
        {
            var user = new ApplicationUser { UserName = req.Email, Email = req.Email, EmailConfirmed = true };
            var result = await _users.CreateAsync(user, req.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);
            await _users.AddToRoleAsync(user, "User");
            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest req)
        {
            var user = await _users.FindByEmailAsync(req.Email);
            if (user is null) return Unauthorized();

            var ok = await _users.CheckPasswordAsync(user, req.Password);
            if (!ok) return Unauthorized();

            var roles = await _users.GetRolesAsync(user);
            var token = CreateJwt(user, roles);
            return new AuthResponse(token);
        }

        private string CreateJwt(ApplicationUser user, IList<string> roles)
        {
            var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(ClaimTypes.NameIdentifier, user.Id),
        };
            foreach (var r in roles) claims.Add(new Claim(ClaimTypes.Role, r));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_cfg["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _cfg["Jwt:Issuer"],
                audience: _cfg["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
