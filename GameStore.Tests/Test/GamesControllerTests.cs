using GameStore.Api.Controllers;
using GameStore.Api.DTOs.Videogames;
using GameStore.Api.Helper;
using GameStore.Infrastructure.Persistence.Videogames;
using GameStore.Tests.Mapper;
using GameStore.Tests.Repository;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace GameStore.Tests.Test
{
    public class GamesControllerTests
    {
        [Fact]
        public async Task List_ShouldReturnVideogames()
        {
            // Arrange
            var db = await VideogameRepositoryTest.GetDatabaseContext();
            var mapper = TestMapperFactory.CreateMapper();
            var controller = new GamesController(db, mapper);

            // Act
            var result = await controller.List();

            // Assert
            var ok = Assert.IsType<OkObjectResult>(result);

            var response = Assert.IsType<PaginatedResponse<VideogameDTO>>(ok.Value);

            Assert.Equal(10, response.Total);
            Assert.Equal(10, response.Items.Count);
        }




        [Fact]
        public async Task Get_ShouldReturnVideogame_WhenExists()
        {
            var db = await VideogameRepositoryTest.GetDatabaseContext();
            var mapper = TestMapperFactory.CreateMapper();
            var controller = new GamesController(db, mapper);

            var existing = db.Videogames.First();

            var result = await controller.Get(existing.Id, CancellationToken.None);

            var ok = Assert.IsType<OkObjectResult>(result);
            var dto = ok.Value;

            Assert.NotNull(dto);
        }

        [Fact]
        public async Task Get_ShouldReturnNotFound_WhenIdDoesNotExist()
        {
            var db = await VideogameRepositoryTest.GetDatabaseContext();
            var mapper = TestMapperFactory.CreateMapper();
            var controller = new GamesController(db, mapper);

            var result = await controller.Get(9999, CancellationToken.None);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task Create_ShouldInsertVideogame()
        {
            // Arrange
            var db = await VideogameRepositoryTest.GetDatabaseContext();
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
        }

        [Fact]
        public async Task Update_ShouldModifyVideogame()
        {
            var db = await VideogameRepositoryTest.GetDatabaseContext();
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
            dynamic updated = ok.Value;

            Assert.Equal("Updated Game", updated.Name);
        }

        [Fact]
        public async Task Delete_ShouldRemoveVideogame()
        {
            var db = await VideogameRepositoryTest.GetDatabaseContext();
            var mapper = TestMapperFactory.CreateMapper();
            var controller = new GamesController(db, mapper);

            var vg = db.Videogames.First();

            var result = await controller.Delete(vg.Id);

            Assert.IsType<NoContentResult>(result);
            Assert.False(db.Videogames.Any(v => v.Id == vg.Id));
        }




    }
}
