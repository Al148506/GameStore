using AutoMapper;
using GameStore.Api.Controllers;
using GameStore.Api.Dtos.Cart;
using GameStore.Api.DTOs.Cart;
using GameStore.Infrastructure.Persistence.Videogames;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using GameStore.Tests.Mapper;
using GameStore.Tests.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Tests.Test
{
    public class CartControllerTests
    {
        private CartController BuildController(VideogamesDbContext db, IMapper mapper, string userId)
        {
            var controller = new CartController(db, mapper);

            var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
            new Claim(ClaimTypes.NameIdentifier, userId)
        }, "test"));

            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext()
                {
                    User = user
                }
            };

            return controller;
        }

        // =========================================================
        //                      GET CART
        // =========================================================

        [Fact]
        public async Task GetCartByUser_ShouldEmpyCart_WhenUserHasNoCart()
        {
            // Arrange
            var db = await VideogameRepositoryTest.GetDatabaseContext(Guid.NewGuid().ToString());
            var mapper = TestMapperFactory.CreateMapper();
            var controller = BuildController(db, mapper, "user123");
            // Act
            var result = await controller.GetCartByUser();
            // Assert
            var ok = Assert.IsType<OkObjectResult>(result.Result);
        }


        [Fact]
        public async Task GetCartByUser_ShouldReturnCart_WhenExists()
        {
            // Arrange
            var db = await VideogameRepositoryTest.GetDatabaseContext(Guid.NewGuid().ToString());
            var mapper = TestMapperFactory.CreateMapper();

            db.Carts.Add(new Cart
            {
                UserId = "user123",
                CreatedAt = DateTime.UtcNow,
                IsCheckedOut = false
            });
            await db.SaveChangesAsync();

            var controller = BuildController(db, mapper, "user123");

            // Act
            var result = await controller.GetCartByUser();

            // Assert
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            Assert.IsType<CartReadDto>(ok.Value);
        }
        // =========================================================
        //                      CREATE CART
        // =========================================================

        [Fact]
        public async Task CreateCart_ShouldReturnBadRequest_WhenCartIsEmpty()
        {
            // Arrange
            var db = await VideogameRepositoryTest.GetDatabaseContext(Guid.NewGuid().ToString());
            var mapper = TestMapperFactory.CreateMapper();
            var controller = BuildController(db, mapper, "user123");

            var dto = new CartCreateDto
            {
                Items = new List<CartItemCreateDto>()
            };

            // Act
            var result = await controller.CreateCart(dto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task CreateCart_ShouldCreateCart_WhenValid()
        {
            // Arrange
            var db = await VideogameRepositoryTest.GetDatabaseContext(Guid.NewGuid().ToString());
            var mapper = TestMapperFactory.CreateMapper();

            var controller = BuildController(db, mapper, "user123");

            var dto = new CartCreateDto
            {
                Items = new()
                {
                    new CartItemCreateDto { VideogameId = 1, Quantity = 2 }
                }
            };

            // Act
            var result = await controller.CreateCart(dto);

            // Assert
            var created = Assert.IsType<CreatedAtActionResult>(result.Result);
            var cartDto = Assert.IsType<CartReadDto>(created.Value);

            Assert.Single(cartDto.Items);
        }

        // =========================================================
        //                        CHECKOUT
        // =========================================================

        [Fact]
        public async Task Checkout_ShouldReturnBadRequest_WhenCartIsEmpty()
        {
            // Arrange
            var db = await VideogameRepositoryTest.GetDatabaseContext(Guid.NewGuid().ToString());
            var mapper = TestMapperFactory.CreateMapper();

            db.Carts.Add(new Cart
            {
                UserId = "user123",
                CreatedAt = DateTime.UtcNow,
                IsCheckedOut = false
            });
            await db.SaveChangesAsync();

            var controller = BuildController(db, mapper, "user123");

            // Act
            var result = await controller.Checkout();

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

    }
}
