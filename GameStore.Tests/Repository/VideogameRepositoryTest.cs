using GameStore.Api.Controllers;
using GameStore.Infrastructure.Persistence.Videogames;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Tests.Repository
{
    public class VideogameRepositoryTest
    {
        public static async Task<VideogamesDbContext> GetDatabaseContext()
        {
            var options = new DbContextOptionsBuilder<VideogamesDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            var databaseContext = new VideogamesDbContext(options);
            databaseContext.Database.EnsureCreated();
            if (await databaseContext.Videogames.CountAsync() <= 0)
            {
                // 1️⃣ Crear géneros dummy
                var dummyGenres = new List<Genre>
            {
                new Genre { Name = "Action" },
                new Genre { Name = "Adventure" },
                new Genre { Name = "RPG" },
                new Genre { Name = "Shooter" },
                new Genre { Name = "Horror" }
            };

                databaseContext.Genres.AddRange(dummyGenres);

                // 2️⃣ Crear plataformas dummy
                var dummyPlatforms = new List<Platform>
            {
                new Platform { Name = "PC" },
                new Platform { Name = "PlayStation" },
                new Platform { Name = "Xbox" },
                new Platform { Name = "Nintendo Switch" }
            };

                databaseContext.Platforms.AddRange(dummyPlatforms);

                // 3️⃣ Crear videojuegos dummy
                var videogamesList = new List<Videogame>();


                for (int i = 1; i <= 10; i++)
                {
                    var videogame = new Videogame
                    {
                        Name = $"Game {i}",
                        Description = $"Description for Game {i}",
                        Price = 9.99m + i,
                        Stock = 5 + i,
                        ReleaseDate = DateTime.UtcNow.AddDays(-i * 7),
                        Rating = "E",
                        ImageUrl = $"https://via.placeholder.com/300x450?text=Game+{i}",

                        // Seleccionar 2 géneros aleatorios
                        Genres = dummyGenres
                            .OrderBy(g => Guid.NewGuid())
                            .Take(2)
                            .ToList(),

                        // Seleccionar 2 plataformas aleatorias
                        Platforms = dummyPlatforms
                            .OrderBy(p => Guid.NewGuid())
                            .Take(2)
                            .ToList()
                    };

                    videogamesList.Add(videogame);
                }
                databaseContext.Videogames.AddRange(videogamesList);
                await databaseContext.SaveChangesAsync();
            }
            return databaseContext;
        }

    }
}
