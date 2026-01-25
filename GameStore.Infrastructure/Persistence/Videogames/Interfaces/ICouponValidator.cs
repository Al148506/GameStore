
using GameStore.Infrastructure.Persistence.Videogames.Models;

namespace GameStore.Infrastructure.Persistence.Videogames.Interfaces
{
    public interface ICouponValidator
    {
        Task<Discount?> ValidateAsync(string couponCode);
        Task RegisterUsageAsync(Guid couponId);
    }
}
