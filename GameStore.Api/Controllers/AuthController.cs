using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GameStore.Api.Dtos.Auth;
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
            _users = users;
            _signIn = signIn;
            _cfg = cfg;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDto req)
        {
            var user = new ApplicationUser
            {
                UserName = req.email,
                Email = req.email,
                EmailConfirmed = true
            };

            var result = await _users.CreateAsync(user, req.password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _users.AddToRoleAsync(user, "User");
            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginRequestDto req)
        {
            var user = await _users.FindByEmailAsync(req.email);
            if (user is null) return Unauthorized();

            var ok = await _users.CheckPasswordAsync(user, req.password);
            if (!ok) return Unauthorized();

            var roles = await _users.GetRolesAsync(user);
            var token = CreateJwt(user, roles);

            return new AuthResponseDto
            {
                accessToken = token,
                email = user.Email!,
                roles = roles
            };
        }

        [HttpPost("GrantAdmin")]
        public async Task<IActionResult> GrantAdmin(GrantAdminRequestDto req)
        {
            var user = await _users.FindByEmailAsync(req.email);
            if (user is null) return NotFound();
            var isAdmin = await _users.IsInRoleAsync(user, "Admin");
            if (isAdmin) return BadRequest("User is already an admin.");
            await _users.AddToRoleAsync(user, "Admin");
            return Ok();
        }
        private string CreateJwt(ApplicationUser user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id),
                new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new(ClaimTypes.NameIdentifier, user.Id)
            };

            foreach (var r in roles)
                claims.Add(new Claim(ClaimTypes.Role, r));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_cfg["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _cfg["Jwt:Issuer"],
                audience: _cfg["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMonths(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
