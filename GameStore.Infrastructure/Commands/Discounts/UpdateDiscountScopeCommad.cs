using GameStore.Infrastructure.Persistence.Videogames.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Infrastructure.Commands.Discounts
{
    public class UpdateDiscountScopeCommand
    {
        public Guid Id { get; set; }
        public DiscountTargetType TargetType { get; set; }
        public int? TargetId { get; set; }
    }
}
