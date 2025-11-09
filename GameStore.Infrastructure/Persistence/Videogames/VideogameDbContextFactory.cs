using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace GameStore.Infrastructure.Persistence.Videogames
{
    public class VideogamesDbContextFactory : IDesignTimeDbContextFactory<VideogamesDbContext>
    {
        public VideogamesDbContext CreateDbContext(string[] args)
        {

            var configuration = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory())      // Directorio actual del proyecto
               .AddJsonFile("appsettings.json", optional: true)  // Leer archivo appsettings.json
               .AddUserSecrets<VideogamesDbContextFactory>()     // Leer user-secrets basados en el assembly
               .Build();

            var optionsBuilder = new DbContextOptionsBuilder<VideogamesDbContext>();

            var connectionString = configuration.GetConnectionString("DefaultConnection");
            optionsBuilder.UseSqlServer(connectionString);

            return new VideogamesDbContext(optionsBuilder.Options);
        }
    }
}
