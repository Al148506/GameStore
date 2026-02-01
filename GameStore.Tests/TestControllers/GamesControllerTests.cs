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
using Xunit;

namespace GameStore.Tests.Test
{
    public class GamesControllerTests
    {
        // ------------------------------
        // Helper
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
        public async Task List_ShouldReturnAllGames()
        {
            var controller = await BuildController();

            var result = await controller.List();

            var ok = Assert.IsType<OkObjectResult>(result);
            var response = Assert.IsType<PaginatedResponse<VideogameDTO>>(ok.Value);

            Assert.Equal(10, response.Total);
            Assert.Equal(10, response.Items.Count);
        }

        // ------------------------------
        // GET
        // ------------------------------
        [Fact]
        public async Task Get_WhenExists_ShouldReturnGame()
        {
            var db = await VideogameRepositoryTest.GetDatabaseContext(Guid.NewGuid().ToString());
            var mapper = TestMapperFactory.CreateMapper();
            var controller = new GamesController(db, mapper);

            var existing = db.Videogames.First();

            var result = await controller.Get(existing.Id, CancellationToken.None);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(ok.Value);
        }

        [Fact]
        public async Task Get_WhenNotExists_ShouldReturnNotFound()
        {
            var controller = await BuildController();

            var result = await controller.Get(9999, CancellationToken.None);

            Assert.IsType<NotFoundResult>(result);
        }

        // ------------------------------
        // CREATE
        // ------------------------------
        [Fact]
        public async Task Create_WhenValid_ShouldCreateGame()
        {
            var db = await VideogameRepositoryTest.GetDatabaseContext(Guid.NewGuid().ToString());
            var mapper = TestMapperFactory.CreateMapper();
            var controller = new GamesController(db, mapper);

            var dto = new CreateVideogameRequestDto
            {
                Name = "New Game",
                Description = "Test",
                Price = 15,
                Stock = 10,
                ImageUrl = "img.png",
                Rating = "M",
                ReleaseDate = DateTime.UtcNow,
                GenreIds = new List<int> { db.Genres.First().Id },
                PlatformIds = new List<int> { db.Platforms.First().Id }
            };

            var result = await controller.Create(dto);

            var ok = Assert.IsType<OkObjectResult>(result);
            var game = Assert.IsType<Videogame>(ok.Value);

            Assert.Equal("New Game", game.Name);
            Assert.Single(game.Genres);
            Assert.True(db.Videogames.Any(v => v.Name == "New Game"));
        }

        [Fact]
        public async Task Create_WhenNameMissing_ShouldReturnBadRequest()
        {
            var controller = await BuildController();

            var dto = new CreateVideogameRequestDto
            {
                Name = "",
                Description = "Test",
                Price = 10,
                Stock = 1,
                ImageUrl = "img.png",
                Rating = "E",
                ReleaseDate = DateTime.UtcNow,
                GenreIds = new List<int> { 1 },
                PlatformIds = new List<int> { 1 }
            };

            controller.ModelState.AddModelError("Name", "Required");

            var result = await controller.Create(dto);

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Create_WhenGenreNotExists_ShouldReturnBadRequest()
        {
            var db = await VideogameRepositoryTest.GetDatabaseContext(Guid.NewGuid().ToString());
            var mapper = TestMapperFactory.CreateMapper();
            var controller = new GamesController(db, mapper);

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
                PlatformIds = new List<int> { db.Platforms.First().Id }
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
            var db = await VideogameRepositoryTest.GetDatabaseContext(Guid.NewGuid().ToString());
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
            var updated = Assert.IsType<VideogameDTO>(ok.Value);

            Assert.Equal("Updated Game", updated.Name);

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
        public async Task Delete_WhenExists_ShouldRemoveGame()
        {
            var db = await VideogameRepositoryTest.GetDatabaseContext(Guid.NewGuid().ToString());
            var mapper = TestMapperFactory.CreateMapper();
            var controller = new GamesController(db, mapper);

            var vg = db.Videogames.First();

            var result = await controller.Delete(vg.Id);

            Assert.IsType<NoContentResult>(result);
            Assert.False(db.Videogames.Any(v => v.Id == vg.Id));
        }

        [Fact]
        public async Task Delete_WhenNotExists_ShouldReturnNotFound()
        {
            var controller = await BuildController();

            var result = await controller.Delete(9999);

            Assert.IsType<NotFoundResult>(result);
        }
    }
}
