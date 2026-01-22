using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Infrastructure.Persistence.Videogames.Interfeces
{
    public interface ICouponValidator
    {
        Task<bool> IsValidAsync(string code, string userId);
    }

}
