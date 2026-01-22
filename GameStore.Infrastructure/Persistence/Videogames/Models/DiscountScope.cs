using GameStore.Infrastructure.Persistence.Videogames.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Infrastructure.Persistence.Videogames.Models
{
    public class DiscountScope
    {
        public Guid Id { get; set; }
        public DiscountTargetType TargetType;
        // All | Videogame | Genre | Platform

        public Guid? TargetId { get; set; }
    }

}
