using GameStore.Infrastructure.Persistence.Videogames.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Infrastructure.Persistence.Videogames.Models
{
    public class Discount
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DiscountType Type { get; set; } // Seasonal | Coupon
        public DiscountValueType ValueType { get; set; } // Percentage | Fixed
        public decimal Value { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; }
    }

}
