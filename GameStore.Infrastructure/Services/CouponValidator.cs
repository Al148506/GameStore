using GameStore.Infrastructure.Persistence.Videogames;
using GameStore.Infrastructure.Persistence.Videogames.Interfaces;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Infrastructure.Services
{
    public class CouponValidator : ICouponValidator
    {
        private readonly VideogamesDbContext _context;

        public CouponValidator(VideogamesDbContext context)
        {
            _context = context;
        }

        public async Task<Discount?> ValidateAsync(string couponCode)
        {
            var discount = await _context.Discounts
                .Include(d => d.Coupon)
                .Include(d => d.DiscountScopes)
                .FirstOrDefaultAsync(d =>
                    d.Coupon != null &&
                    d.Coupon.Code == couponCode &&
                    d.IsActive &&
                    d.StartDate <= DateTime.UtcNow &&
                    d.EndDate >= DateTime.UtcNow
                );

            if (discount == null)
                return null;

            var coupon = discount.Coupon!;

            if (coupon.MaxUses.HasValue &&
                coupon.UsedCount >= coupon.MaxUses.Value)
            {
                return null;
            }

            return discount;
        }

        public async Task RegisterUsageAsync(Guid couponId)
        {
            var coupon = await _context.Coupons
                .FirstOrDefaultAsync(c => c.Id == couponId);

            if (coupon == null)
                return;

            coupon.UsedCount += 1;
            await _context.SaveChangesAsync();
        }
    }
}
