using GameStore.Infrastructure.Persistence.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;

namespace GameStore.Api.Helper
{
    public static class AdminSeedExtensions
    {
        public static async Task PromoteAdminFromConfigAsync(this IHost app)
        {
            try
            {
                using var scope = app.Services.CreateScope();

                var logger = scope.ServiceProvider
                    .GetRequiredService<ILoggerFactory>()
                    .CreateLogger("AdminSeed");

                var cfg = scope.ServiceProvider.GetRequiredService<IConfiguration>();
                var userMgr = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var roleMgr = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                // Asegura que existan los roles
                foreach (var r in new[] { "Admin", "User" })
                {
                    if (!await roleMgr.RoleExistsAsync(r))
                        await roleMgr.CreateAsync(new IdentityRole(r));
                }

                var email = cfg["AdminUser:Email"];
                if (string.IsNullOrWhiteSpace(email)) return;

                var user = await userMgr.FindByEmailAsync(email);
                if (user is null) return;

                if (!await userMgr.IsInRoleAsync(user, "Admin"))
                    await userMgr.AddToRoleAsync(user, "Admin");
            }
            catch (SqlException ex)
            {
                // Error típico: base de datos no disponible
                Console.WriteLine($"[AdminSeed] DB no disponible: {ex.Message}");
            }
            catch (Exception ex)
            {
                // Cualquier otro error inesperado
                Console.WriteLine($"[AdminSeed] Error inesperado: {ex}");
            }
        }
    }
}
