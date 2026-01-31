using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Infrastructure.Commands.Discounts
{
    
        public class UpdateCouponCommand
        {
            public Guid Id { get; set; }
            public string Code { get; set; } = default!;
            public int? MaxUses { get; set; }
        }
    

}
