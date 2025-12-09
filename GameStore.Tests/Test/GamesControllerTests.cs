using GameStore.Api.Controllers;
using GameStore.Api.DTOs.Videogames;
using GameStore.Api.Helper;
using GameStore.Infrastructure.Persistence.Videogames;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using GameStore.Tests.Mapper;
using GameStore.Tests.Repository;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GameStore.Tests.Test
{
    public class GamesControllerTests
    {
        // ------------------------------
        // Helper para construir controller
        // ------------------------------
        private async Task<GamesController> BuildController()
        {
            var db = await VideogameRepositoryTest.GetDatabaseContext(Guid.NewGuid().ToString());
            var mapper = TestMapperFactory.CreateMapper();
            return new GamesController(db, mapper);
        }

        // ------------------------------
        // LIST
        // ------------------------------
        [Fact]
        {
            // Arrange

            // Act
            var result = await controller.List();

            // Assert
            var ok = Assert.IsType<OkObjectResult>(result);

            var response = Assert.IsType<PaginatedResponse<VideogameDTO>>(ok.Value);

            Assert.Equal(10, response.Total);
            Assert.Equal(10, response.Items.Count);
        }

        [Fact]
        {
            var mapper = TestMapperFactory.CreateMapper();
            var controller = new GamesController(db, mapper);

            var existing = db.Videogames.First();

            var result = await controller.Get(existing.Id, CancellationToken.None);

            var ok = Assert.IsType<OkObjectResult>(result);

        }

        [Fact]
        {

            var result = await controller.Get(9999, CancellationToken.None);

            Assert.IsType<NotFoundResult>(result);
        }

        // ------------------------------
        // CREATE
        // ------------------------------
        [Fact]
        {
            // Arrange
            var mapper = TestMapperFactory.CreateMapper();
            var controller = new GamesController(db, mapper);

            var genre = db.Genres.First();
            var platform = db.Platforms.First();

            var dto = new CreateVideogameRequestDto
            {
                Name = "New Game",
                Description = "Test",
                Price = 15,
                Stock = 10,
                ImageUrl = "img.png",
                Rating = "M",
                ReleaseDate = DateTime.UtcNow,
                GenreIds = new List<int> { genre.Id },
                PlatformIds = new List<int> { platform.Id }
            };

            // Act
            var result = await controller.Create(dto);

            // Assert
            var ok = Assert.IsType<OkObjectResult>(result);
            var game = Assert.IsType<Videogame>(ok.Value);

            Assert.Equal("New Game", game.Name);
            Assert.Single(game.Genres);

            // Validate DB
            Assert.True(db.Videogames.Any(v => v.Name == "New Game"));
        }

        [Fact]
        public async Task Create_WhenNameMissing_ShouldReturnBadRequest()
        {
            var db = await VideogameRepositoryTest.GetDatabaseContext(Guid.NewGuid().ToString());
            var mapper = TestMapperFactory.CreateMapper();
            var controller = new GamesController(db, mapper);

            var genreId = db.Genres.First().Id;
            var platformId = db.Platforms.First().Id;

            var dto = new CreateVideogameRequestDto
            {
                Name = "", // string vacía para simular falta de nombre
                Description = "Test",
                Price = 10,
                Stock = 1,
                ImageUrl = "img.png",
                Rating = "E",
                ReleaseDate = DateTime.UtcNow,
                GenreIds = new List<int> { genreId },
                PlatformIds = new List<int> { platformId }
            };
            controller.ModelState.AddModelError("Name", "Required");

            var result = await controller.Create(dto);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        {
            var mapper = TestMapperFactory.CreateMapper();
            var controller = new GamesController(db, mapper);

            var platformId = db.Platforms.First().Id;

            var dto = new CreateVideogameRequestDto
            {
                Name = "Game",
                Description = "Test",
                Price = 10,
                Stock = 1,
                ImageUrl = "img.png",
                Rating = "E",
                ReleaseDate = DateTime.UtcNow,
                GenreIds = new List<int> { 99999 },
                PlatformIds = new List<int> { platformId }
            };

            var result = await controller.Create(dto);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        // ------------------------------
        // UPDATE
        // ------------------------------
        [Fact]
        public async Task Update_WhenValid_ShouldModifyVideogame()
        {
            var dbName = Guid.NewGuid().ToString();
            var db = await VideogameRepositoryTest.GetDatabaseContext(dbName);
            var mapper = TestMapperFactory.CreateMapper();
            var controller = new GamesController(db, mapper);

            var vg = db.Videogames.First();

            var dto = new UpdateVideogameRequestDto
            {
                Name = "Updated Game",
                Description = vg.Description,
                Price = vg.Price,
                Stock = vg.Stock,
                ImageUrl = vg.ImageUrl,
                Rating = vg.Rating,
                ReleaseDate = vg.ReleaseDate,
                GenreIds = new List<int> { db.Genres.Last().Id },
                PlatformIds = new List<int> { db.Platforms.Last().Id }
            };

            var result = await controller.Update(vg.Id, dto);

            var ok = Assert.IsType<OkObjectResult>(result);

            Assert.Equal("Updated Game", updated.Name);

            // Validate DB
            var saved = await db.Videogames.FindAsync(vg.Id);
            Assert.Equal("Updated Game", saved?.Name);
        }

        [Fact]
        public async Task Update_WhenIdNotExist_ShouldReturnNotFound()
        {
            var controller = await BuildController();

            var dto = new UpdateVideogameRequestDto
            {
                Name = "Doesnt Matter",
                Description = "Test",
                Price = 10,
                Stock = 1,
                ImageUrl = "img.png",
                Rating = "E",
                ReleaseDate = DateTime.UtcNow,
                GenreIds = new List<int> { 1 },
                PlatformIds = new List<int> { 1 }
            };

            var result = await controller.Update(9999, dto);

            Assert.IsType<NotFoundResult>(result);
        }

        // ------------------------------
        // DELETE
        // ------------------------------
        [Fact]
        {
            var mapper = TestMapperFactory.CreateMapper();
            var controller = new GamesController(db, mapper);

            var vg = db.Videogames.First();

            var result = await controller.Delete(vg.Id);

            Assert.IsType<NoContentResult>(result);
            Assert.False(db.Videogames.Any(v => v.Id == vg.Id));
        }


            var result = await controller.Delete(9999);

            Assert.IsType<NotFoundResult>(result);
        }
    }
}
