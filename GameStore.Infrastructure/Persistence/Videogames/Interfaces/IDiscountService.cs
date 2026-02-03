using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Infrastructure.Persistence.Videogames.Interfaces
{
    public interface IDiscountService
    {
        Task<decimal> ApplyDiscountAsync(
            Videogame videogame,
            decimal originalPrice,
            string? couponCode = null
        );
    }

}
