using AutoMapper;
using GameStore.Api.Controllers;
using GameStore.Api.Dtos.Cart;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using GameStore.Infrastructure.Persistence.Videogames;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using System.Security.Claims;


namespace GameStore.Tests.TestControllers
{
    public class CartItemControllerTest
    {
        private static ControllerContext CreateControllerContext(string userId)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId)
            };

            var identity = new ClaimsIdentity(claims, "TestAuth");
            var user = new ClaimsPrincipal(identity);

            return new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = user
                }
            };
        }

        private static VideogamesDbContext CreateContext()
        {
            var options = new DbContextOptionsBuilder<VideogamesDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new VideogamesDbContext(options);
        }

        private static Videogame CreateValidVideogame(int id = 10)
        {
            return new Videogame
            {
                Id = id,
                 Name = "New Game",
                Description = "Test",
                Price = 100,
                Stock = 10,
                ImageUrl = "img.png",
                Rating = "M",
                ReleaseDate = DateTime.UtcNow,
                Genres = new List<Genre>(),
                Platforms = new List<Platform>()
            };
        }


        // =========================================================

       

        [Fact]
        public async Task AddItemToCart_ExistingItem_ShouldIncreaseQuantity()
        {
            var context = CreateContext();
            var mapper = new Mock<IMapper>().Object;
            var discountServiceMock = new Mock<IDiscountService>();

            var userId = "user-1";

            var cart = new Cart
            {
                UserId = userId,
                IsCheckedOut = false
            };

            var item = new CartItem
            {
                VideogameId = 10,
                Quantity = 1,
               UnitPrice = 100,
                DiscountedUnitPrice = 80,
                Cart = cart
            };

            context.Carts.Add(cart);
            context.CartItems.Add(item);
            var videogame = CreateValidVideogame(10);
            context.Videogames.Add(videogame);

            await context.SaveChangesAsync();

            var controller = new CartItemController(
                context,
                mapper,
                discountServiceMock.Object);

            controller.ControllerContext = CreateControllerContext(userId);

            await controller.AddItemToCart(new CartItemCreateDto
            {
                VideogameId = 10,
                Quantity = 2
            });

            Assert.Equal(3, context.CartItems.Single().Quantity);
        }

        [Fact]
        public async Task DecreaseItemQuantity_ShouldDecrease()
        {
            var context = CreateContext();
            var mapper = new Mock<IMapper>().Object;
            var discountServiceMock = new Mock<IDiscountService>();

            var userId = "user-1";

            var cart = new Cart
            {
                UserId = userId,
                IsCheckedOut = false
            };

            var item = new CartItem
            {
                VideogameId = 10,
                Quantity = 2,
               UnitPrice = 100,
                DiscountedUnitPrice = 80,
                Cart = cart
            };

            context.Carts.Add(cart);
            context.CartItems.Add(item);

            await context.SaveChangesAsync();

            var controller = new CartItemController(
                context,
                mapper,
                discountServiceMock.Object);

            controller.ControllerContext = CreateControllerContext(userId);

            await controller.DecreaseItemQuantity(item.Id);

            Assert.Equal(1, context.CartItems.Single().Quantity);
        }

        [Fact]
        public async Task DecreaseItemQuantity_WhenZero_ShouldRemoveItem()
        {
            var context = CreateContext();
            var mapper = new Mock<IMapper>().Object;
            var discountServiceMock = new Mock<IDiscountService>();

            var userId = "user-1";

            var cart = new Cart
            {
                UserId = userId,
                IsCheckedOut = false
            };

            var item = new CartItem
            {
                VideogameId = 10,
                Quantity = 1,
                UnitPrice = 100,
                DiscountedUnitPrice = 80,
                Cart = cart
            };

            context.Carts.Add(cart);
            context.CartItems.Add(item);

            await context.SaveChangesAsync();

            var controller = new CartItemController(
                context,
                mapper,
                discountServiceMock.Object);

            controller.ControllerContext = CreateControllerContext(userId);

            await controller.DecreaseItemQuantity(item.Id);

            Assert.Empty(context.CartItems);
        }
    }
}
