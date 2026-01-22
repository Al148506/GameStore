using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Infrastructure.Persistence.Videogames.Enums
{
    public enum DiscountType
    {
        Seasonal,
        Coupon
    }

    public enum DiscountValueType
    {
        Percentage,
        Fixed
    }

    public enum DiscountTargetType
    {
        All,
        Videogame,
        Genre,
        Platform
    }

}
