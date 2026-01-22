using GameStore.Infrastructure.Persistence.Videogames.Interfeces;
using GameStore.Infrastructure.Persistence.Videogames;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Infrastructure.Services
{
    public class DiscountService : IDiscountService
    {
        public Task<decimal> ApplyDiscountAsync(Videogame videogame, decimal originalPrice, string? couponCode = null)
        {
            throw new NotImplementedException();
        }
    }

}
