using GameStore.Infrastructure.Persistence.Auth;
using GameStore.Infrastructure.Persistence.Videogames;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

public class ApplicationAuthDbContextFactory : IDesignTimeDbContextFactory<ApplicationAuthDbContext>
{
    public ApplicationAuthDbContext CreateDbContext(string[] args)
    {

        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())      // Directorio actual del proyecto
            .AddJsonFile("appsettings.json", optional: true)  // Leer archivo appsettings.json
            .AddUserSecrets<VideogamesDbContextFactory>()     // Leer user-secrets basados en el assembly
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationAuthDbContext>();

        var connectionString = configuration.GetConnectionString("AuthDbConnection");
        optionsBuilder.UseSqlServer(connectionString);
        return new ApplicationAuthDbContext(optionsBuilder.Options);
    }
}
