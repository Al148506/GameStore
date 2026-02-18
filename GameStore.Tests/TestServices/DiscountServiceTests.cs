using GameStore.Infrastructure.Persistence.Videogames.Interfaces;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using GameStore.Infrastructure.Persistence.Videogames.Enums;
using GameStore.Infrastructure.Services;
using Moq;
using Xunit;
using GameStore.Infrastructure.Persistence.Videogames;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GameStore.Tests.TestServices
{
    public class DiscountServiceTests
    {
        private readonly Mock<IDiscountRepository> _discountRepositoryMock;
        private readonly Mock<ICouponValidator> _couponValidatorMock;
        private readonly DiscountService _discountService;

        public DiscountServiceTests()
        {
            _discountRepositoryMock = new Mock<IDiscountRepository>();
            _couponValidatorMock = new Mock<ICouponValidator>();

            // Por defecto, ningún cupón válido
            _couponValidatorMock
                .Setup(c => c.ValidateAsync(It.IsAny<string>()))
                .ReturnsAsync((Discount?)null);

            _discountService = new DiscountService(
                _discountRepositoryMock.Object,
                _couponValidatorMock.Object
            );
        }

        [Fact]
        public async Task ApplyCouponToCartAsync_ShouldApplyOnlyOnceToSubtotal()
        {
            // Arrange
            var coupon = new Discount
            {
                ValueType = DiscountValueType.Fixed,
                Value = 10,
                Coupon = new Coupon { Id = Guid.NewGuid() }
            };

            _couponValidatorMock
                .Setup(c => c.ValidateAsync("SAVE10"))
                .ReturnsAsync(coupon);

            _couponValidatorMock
                .Setup(c => c.RegisterUsageAsync(It.IsAny<Guid>()))
                .Returns(Task.CompletedTask);

            var cartItems = new List<CartItem>
            {
                new CartItem { UnitPrice = 40, Quantity = 1 },
                new CartItem { UnitPrice = 30, Quantity = 2 } // 60
            };

            decimal subtotal = cartItems.Sum(i => i.UnitPrice * i.Quantity);


            // Act
            var total = await _discountService
                .ApplyCouponToCartAsync(subtotal, "SAVE10");

            // Assert
            Assert.Equal(90, total);
        }


        [Fact]
        public async Task ApplyAutomaticDiscountsAsync_GlobalDiscount_ShouldApply()
        {
            var videogame = new Videogame
            {
                Id = 1,
                Price = 100,
                Genres = new List<Genre>(),
                Platforms = new List<Platform>()
            };

            var discount = new Discount
            {
                ValueType = DiscountValueType.Percentage,
                Value = 20,
                IsActive = true,
                DiscountScopes = new List<DiscountScope>
        {
            new DiscountScope
            {
                TargetType = DiscountTargetType.All
            }
        }
            };

            _discountRepositoryMock
                .Setup(r => r.GetActiveDiscountsAsync())
                .ReturnsAsync(new List<Discount> { discount });

            var finalPrice = await _discountService
                .ApplyAutomaticDiscountsAsync(videogame, videogame.Price);

            Assert.Equal(80, finalPrice);
        }


        [Fact]
        public async Task ApplyDiscountAsync_WrongScope_ShouldNotApply()
        {
            var videogame = new Videogame
            {
                Id = 1,
                Price = 100,
                Genres = new List<Genre>(),
                Platforms = new List<Platform>()
            };

            var discount = new Discount
            {
                ValueType = DiscountValueType.Fixed,
                Value = 50,
                IsActive = true,
                DiscountScopes = new List<DiscountScope>
                {
                    new DiscountScope
                    {
                        TargetType = DiscountTargetType.Videogame,
                        TargetId = 99
                    }
                }
            };

            _discountRepositoryMock
                .Setup(r => r.GetActiveDiscountsAsync())
                .ReturnsAsync(new List<Discount> { discount });

            var finalPrice = await _discountService
      .ApplyAutomaticDiscountsAsync(videogame, videogame.Price);


            Assert.Equal(100, finalPrice);
        }

        [Fact]
        public async Task ApplyDiscountAsync_MultipleDiscounts_ShouldPickBest()
        {
            var videogame = new Videogame
            {
                Id = 1,
                Price = 100,
                Genres = new List<Genre>(),
                Platforms = new List<Platform>()
            };

            var discount10 = new Discount
            {
                ValueType = DiscountValueType.Percentage,
                Value = 10,
                DiscountScopes = new List<DiscountScope>
                {
                    new DiscountScope { TargetType = DiscountTargetType.All }
                }
            };

            var discount30 = new Discount
            {
                ValueType = DiscountValueType.Percentage,
                Value = 30,
                DiscountScopes = new List<DiscountScope>
                {
                    new DiscountScope { TargetType = DiscountTargetType.All }
                }
            };

            _discountRepositoryMock
                .Setup(r => r.GetActiveDiscountsAsync())
                .ReturnsAsync(new List<Discount> { discount10, discount30 });

            var finalPrice = await _discountService
        .ApplyAutomaticDiscountsAsync(videogame, videogame.Price);


            Assert.Equal(70, finalPrice);
        }
    }
}
