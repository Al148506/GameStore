using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Infrastructure.Persistence.Videogames.Models
{
    public class Coupon
    {
        public Guid Id { get; set; }
        public string Code { get; set; }
        public int? MaxUses { get; set; }
        public int UsedCount { get; set; }
    }

}
