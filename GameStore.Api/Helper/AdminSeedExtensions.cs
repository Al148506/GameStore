using GameStore.Infrastructure.Persistence.Auth;
using Microsoft.AspNetCore.Identity;

namespace GameStore.Api.Helper
{
    public static class AdminSeedExtensions
    {
        public static async Task PromoteAdminFromConfigAsync(this IHost app)
        {
            using var scope = app.Services.CreateScope();
            var cfg = scope.ServiceProvider.GetRequiredService<IConfiguration>();
            var userMgr = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleMgr = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            // Asegura que existan los roles
            foreach (var r in new[] { "Admin", "User" })
                if (!await roleMgr.RoleExistsAsync(r)) await roleMgr.CreateAsync(new IdentityRole(r));

            var email = cfg["AdminUser:Email"];
            if (string.IsNullOrWhiteSpace(email)) return;

            var user = await userMgr.FindByEmailAsync(email);
            if (user is null) return; // o crear el usuario si quieres

            if (!await userMgr.IsInRoleAsync(user, "Admin"))
                await userMgr.AddToRoleAsync(user, "Admin");
        }
    }
}
