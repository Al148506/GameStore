using GameStore.Infrastructure.Persistence.Videogames.Interfaces;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Infrastructure.Persistence.Videogames.Repositories
{
    public class DiscountRepository : IDiscountRepository
    {
        private readonly VideogamesDbContext _context;

        public DiscountRepository(VideogamesDbContext context)
        {
            _context = context;
        }

        public async Task<List<Discount>> GetActiveDiscountsAsync()
        {
            var now = DateTime.UtcNow;

            return await _context.Discounts
                .Include(d => d.DiscountScopes)
                .Include(d => d.Coupon)
                .Where(d =>
                    d.IsActive &&
                    d.StartDate <= now &&
                    d.EndDate >= now
                )
                .ToListAsync();
        }

        public async Task<Discount?> GetByIdAsync(Guid id)
        {
            return await _context.Discounts
                .Include(d => d.DiscountScopes)
                .Include(d => d.Coupon)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<Discount?> GetByCouponCodeAsync(string couponCode)
        {
            return await _context.Discounts
                .Include(d => d.DiscountScopes)
                .Include(d => d.Coupon)
                .FirstOrDefaultAsync(d =>
                    d.Coupon != null &&
                    d.Coupon.Code == couponCode &&
                    d.IsActive
                );
        }

        public async Task AddAsync(Discount discount)
        {
            await _context.Discounts.AddAsync(discount);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Discount discount)
        {
            _context.Discounts.Update(discount);
            await _context.SaveChangesAsync();
        }

        public IQueryable<Discount> GetAll()
        {
            return _context.Discounts
                .Include(d => d.Coupon)
                .Include(d => d.DiscountScopes);

        }


        
    }
}
