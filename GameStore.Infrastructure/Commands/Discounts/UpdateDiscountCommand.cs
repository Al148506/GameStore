using GameStore.Infrastructure.Persistence.Videogames.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Infrastructure.Commands.Discounts
{
    public class UpdateDiscountCommand
    {
        public string Name { get; set; } = default!;
        public DiscountType Type { get; set; }
        public DiscountValueType ValueType { get; set; }
        public decimal Value { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }

        public List<UpdateDiscountScopeCommand> Scopes { get; set; } = [];
        public UpdateCouponCommand? Coupon { get; set; }
    }
}
