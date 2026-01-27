using GameStore.Infrastructure.Persistence.Videogames.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Infrastructure.Persistence.Videogames.Interfaces
{
    public interface IDiscountRepository
    {
        Task<List<Discount>> GetActiveDiscountsAsync();

        Task<Discount?> GetByIdAsync(Guid id);

        Task<Discount?> GetByCouponCodeAsync(string couponCode);

        Task AddAsync(Discount discount);

        Task UpdateAsync(Discount discount);

        Task<List<Discount>> GetAllAsync();

        IQueryable<Discount> GetAll();
    }
}
