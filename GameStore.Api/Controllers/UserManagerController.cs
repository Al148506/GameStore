using GameStore.Infrastructure.Persistence.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GameStore.Api.Controllers
{
    [ApiController]
    [Route("api/usermanager")]
    public class UserManagerController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;

        // Inyección por constructor: UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager
        public UserManagerController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
        }
        [HttpPost("assign-admin")]
        public async Task AssignAdminRoleAsync(string userIdOrEmail)
        {
            // 1. Buscar usuario (por id o por email)
            var user = await userManager.FindByIdAsync(userIdOrEmail)
                       ?? await userManager.FindByEmailAsync(userIdOrEmail);

            if (user == null)
            {
                throw new Exception("Usuario no encontrado.");
            }

            // 2. Asegurar que existe el rol "Admin"
            var roleName = "Admin";
            var roleExists = await roleManager.RoleExistsAsync(roleName);
            if (!roleExists)
            {
                var roleResult = await roleManager.CreateAsync(new IdentityRole(roleName));
                if (!roleResult.Succeeded)
                    throw new Exception("No se pudo crear el rol 'Admin': " +
                                        string.Join(", ", roleResult.Errors.Select(e => e.Description)));
            }

            // 3. Asignar el rol al usuario (si aún no lo tiene)
            var isInRole = await userManager.IsInRoleAsync(user, roleName);
            if (!isInRole)
            {
                var addResult = await userManager.AddToRoleAsync(user, roleName);
                if (!addResult.Succeeded)
                    throw new Exception("No se pudo asignar el rol: " +
                                        string.Join(", ", addResult.Errors.Select(e => e.Description)));
            }
        }

    }
}
