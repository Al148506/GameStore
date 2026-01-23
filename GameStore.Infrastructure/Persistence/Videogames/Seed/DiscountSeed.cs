using GameStore.Infrastructure.Persistence.Videogames.Enums;
using GameStore.Infrastructure.Persistence.Videogames.Models;

namespace GameStore.Infrastructure.Persistence.Videogames.Seed
{
    public static class DiscountSeed
    {
        public static async Task SeedAsync(VideogamesDbContext context)
        {
            if (context.Discounts.Any())
                return; // Evita duplicados

            var summerDiscount = new Discount
            {
                Id = Guid.NewGuid(),
                Name = "Summer Sale 20%",
                Type = DiscountType.Seasonal,
                ValueType = DiscountValueType.Percentage,
                Value = 20,
                StartDate = DateTime.UtcNow.AddDays(-1),
                EndDate = DateTime.UtcNow.AddDays(30),
                IsActive = true,
                DiscountScopes = new List<DiscountScope>
                {
                    new DiscountScope
                    {
                        Id = Guid.NewGuid(),
                        TargetType = DiscountTargetType.All
                    }
                }
            };

            var videogameDiscount = new Discount
            {
                Id = Guid.NewGuid(),
                Name = "Discount for Videogame #1",
                Type = DiscountType.Seasonal,
                ValueType = DiscountValueType.Fixed,
                Value = 10,
                StartDate = DateTime.UtcNow.AddDays(-1),
                EndDate = DateTime.UtcNow.AddDays(10),
                IsActive = true,
                DiscountScopes = new List<DiscountScope>
                {
                    new DiscountScope
                    {
                        Id = Guid.NewGuid(),
                        TargetType = DiscountTargetType.Videogame,
                        TargetId = 1 // ⚠️ ID REAL de un videogame existente
                    }
                }
            };

            var couponDiscount = new Discount
            {
                Id = Guid.NewGuid(),
                Name = "WELCOME10",
                Type = DiscountType.Coupon,
                ValueType = DiscountValueType.Percentage,
                Value = 10,
                StartDate = DateTime.UtcNow.AddDays(-1),
                EndDate = DateTime.UtcNow.AddDays(60),
                IsActive = true,
                Coupon = new Coupon
                {
                    Id = Guid.NewGuid(),
                    Code = "WELCOME10",
                    MaxUses = 100,
                    UsedCount = 0
                },
                DiscountScopes = new List<DiscountScope>
                {
                    new DiscountScope
                    {
                        Id = Guid.NewGuid(),
                        TargetType = DiscountTargetType.All
                    }
                }
            };

            await context.Discounts.AddRangeAsync(
                summerDiscount,
                videogameDiscount,
                couponDiscount
            );

            await context.SaveChangesAsync();
        }
    }
}
