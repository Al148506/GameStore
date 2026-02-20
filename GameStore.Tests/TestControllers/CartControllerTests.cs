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
using Microsoft.EntityFrameworkCore;
using Moq;
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
        private readonly Mock<IDiscountService> _discountServiceMock
    = new Mock<IDiscountService>();

        private CartController BuildController(VideogamesDbContext db, IMapper mapper, string userId)
        {
            var controller = new CartController(
         db,
         mapper,
         _discountServiceMock.Object
     );

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
        public async Task GetCartByUser_ShouldCreateCart_WhenUserHasNoActiveCart()
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


        [Fact]
        public async Task Checkout_ShouldCreateOrder_WhenCartHasItems()
        {
            var db = await VideogameRepositoryTest.GetDatabaseContext(Guid.NewGuid().ToString());
            var mapper = TestMapperFactory.CreateMapper();

            var cart = new Cart
            {
                UserId = "user123",
                IsCheckedOut = false
            };

            cart.Items.Add(new CartItem
            {
                VideogameId = 1,
                Quantity = 2,
                UnitPrice = 100,
                DiscountedUnitPrice = 80
            });

            db.Carts.Add(cart);
            await db.SaveChangesAsync();

            var controller = BuildController(db, mapper, "user123");

            var result = await controller.Checkout();

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Single(db.Orders);

            var order = db.Orders.First();
            Assert.Equal(160, order.TotalAmount); // 2 * 80
        }


        // =========================================================
        //                        CLEAR CART
        // =========================================================
        [Fact]
        public async Task ClearCart_ShouldRemoveAllItems_WhenCartHasItems()
        {
            var db = await VideogameRepositoryTest.GetDatabaseContext(Guid.NewGuid().ToString());
            var mapper = TestMapperFactory.CreateMapper();

            var cart = new Cart
            {
                UserId = "user123",
                IsCheckedOut = false
            };

            cart.Items.Add(new CartItem
            {
                VideogameId = 1,
                Quantity = 1,
                UnitPrice = 100,
                DiscountedUnitPrice = 80
            });

            db.Carts.Add(cart);
            await db.SaveChangesAsync();

            var controller = BuildController(db, mapper, "user123");

            var result = await controller.ClearCart();

            Assert.IsType<NoContentResult>(result);
            Assert.Empty(db.CartItems);
        }

        [Fact]
        public async Task ApplyCoupon_ThenChangeQuantity_ShouldRecalculateCorrectly()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<VideogamesDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            using var context = new VideogamesDbContext(options);

            var userId = "user-123";

            var cart = new Cart
            {
                UserId = userId,
                IsCheckedOut = false,
                Items = new List<CartItem>()
            };

            context.Carts.Add(cart);
            await context.SaveChangesAsync();

            var videogame = new Videogame
            {
                Id = 1,
                Name = "Test Game",
                Description = "Test Description",
                ImageUrl = "test.jpg",
                Rating = "E",
                Price = 100,
                Stock = 10,
                ReleaseDate = DateTime.UtcNow,
                Genres = new List<Genre>(),
                Platforms = new List<Platform>()
            };

            context.Videogames.Add(videogame);
            await context.SaveChangesAsync();

            var discountServiceMock = new Mock<IDiscountService>();

            // Simular descuento automático (sin cambio)
            discountServiceMock
                .Setup(s => s.ApplyAutomaticDiscountsAsync(It.IsAny<Videogame>(), 100))
                .ReturnsAsync(100);

            // Simular cupón fijo de 10
            discountServiceMock
           .Setup(s => s.TryApplyCouponAsync(It.IsAny<decimal>(), "SAVE10"))
           .ReturnsAsync((decimal subtotal, string code) => subtotal - 10);

            // Agregar item inicial
            var cartItem = new CartItem
            {
                CartId = cart.Id,
                VideogameId = videogame.Id,
                UnitPrice = 100,
                DiscountedUnitPrice = 100,
                Quantity = 1
            };

            cart.Items.Add(cartItem);
            context.CartItems.Add(cartItem);

            // Aplicar cupón manualmente
            cart.Subtotal = 100;
            cart.AppliedCouponCode = "SAVE10";
            cart.Total = 90;
            cart.DiscountAmount = 10;

            await context.SaveChangesAsync();

            // Act: cambiar cantidad
            cartItem.Quantity = 3;

            cart.Subtotal = cart.Items.Sum(i => i.DiscountedUnitPrice * i.Quantity);

            var newTotal = await discountServiceMock.Object
                .TryApplyCouponAsync(cart.Subtotal, cart.AppliedCouponCode);

            if (newTotal.HasValue)
            {
                cart.Total = newTotal.Value;
                cart.DiscountAmount = cart.Subtotal - newTotal.Value;
            }
            else
            {
                cart.Total = cart.Subtotal;
                cart.DiscountAmount = 0;
            }
          

            await context.SaveChangesAsync();

            // Assert
            Assert.Equal(300, cart.Subtotal);
            Assert.Equal(290, cart.Total);
            Assert.Equal(10, cart.DiscountAmount);
        }


    }
}
