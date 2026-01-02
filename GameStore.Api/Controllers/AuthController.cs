using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GameStore.Api.Dtos.Auth;
using GameStore.Api.DTOs.Auth;
using GameStore.Api.Helper;
using GameStore.Infrastructure.Persistence.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace GameStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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

            var response = new AuthResponseDto
            {
                AccessToken = token,
                User = new UserWithRolesDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    Username = user.UserName ?? user.Email!,
                    Roles = roles
                }
            };

            return Ok(response);
        }

        //Endpoint toggle-admin
        [Authorize(Policy = "RequireAdmin")]
        [HttpPut("toggle-admin/{userId}")]
        public async Task<IActionResult> ToogleAdminRole(string userId)
        {
            var user = await _users.FindByEmailAsync(userId);
            if (user == null)
                return NotFound("Usuario no encontrado.");
            var isAdmin = await _users.IsInRoleAsync(user, "Admin");
            IdentityResult result;

            if (isAdmin)
            {
                result = await _users.RemoveFromRoleAsync(user, "Admin");
            }
            else
            {
                result = await _users.AddToRoleAsync(user, "Admin");
            }
            if (!result.Succeeded)
                return BadRequest("No se pudo actualizar el rol del usuario.");
            return NoContent();
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
        [Authorize(Policy = "RequireAdmin")]
        [HttpGet("list")]
        public async Task<IActionResult> GetUsersAsync([FromQuery] UserQueryParameters query)
        {
            var usersQuery = _users.Users.AsQueryable();

            // === 1. Filtro de búsqueda ===
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var search = query.Search.ToLower();
                usersQuery = usersQuery.Where(u =>
                    u.Email.ToLower().Contains(search) ||
                    u.UserName.ToLower().Contains(search)
                );
            }

            // === 2. Ordenamiento dinámico ===
            usersQuery = query.SortBy.ToLower() switch
            {
                "email" => (query.SortDir == "desc")
                            ? usersQuery.OrderByDescending(u => u.Email)
                            : usersQuery.OrderBy(u => u.Email),

                _ => (query.SortDir == "desc")
                            ? usersQuery.OrderByDescending(u => u.UserName)
                            : usersQuery.OrderBy(u => u.UserName),
            };

            // === 3. Total antes de paginar ===
            var totalItems = await usersQuery.CountAsync();

            // === 4. Paginación ===
            var users = await usersQuery
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            // === 5. Crear DTO principal ===
            var userDtos = new List<UserWithRolesDto>();

            foreach (var user in users)
            {
                var roles = await _users.GetRolesAsync(user);

                userDtos.Add(new UserWithRolesDto
                {
                    Id = user.Id,
                    Username = user.UserName!,
                    Email = user.Email!,
                    Roles = roles.ToList()
                });
            }

            // === 6. Estructurar respuesta ===
            var response = new PaginatedResponse<UserWithRolesDto>
            {
                Items = userDtos,
                Total = totalItems,
                Page = query.PageNumber,
                PageSize = query.PageSize
            };

            return Ok(response);
        }

        [Authorize(Policy = "RequireAdmin")]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto userData)
        {
            var user = await _users.FindByEmailAsync(userData.email);
            if (user is null) return NotFound("Usuario no encontrado");

            var result = await _users.ChangePasswordAsync(
                 user,
                 userData.password,      
                 userData.newPassword    
             );

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok("Contraseña actualizada correctamente");
        }

    }
}
