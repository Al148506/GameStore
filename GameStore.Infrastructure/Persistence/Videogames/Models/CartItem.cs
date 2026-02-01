using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GameStore.Infrastructure.Persistence.Videogames.Models;
namespace GameStore.Infrastructure.Persistence.Videogames.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int CartId { get; set; }
        public int VideogameId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountedUnitPrice { get; set; }
        public decimal Total =>UnitPrice * Quantity;
        public decimal TotalDiscounted => DiscountedUnitPrice * Quantity;

        public Cart Cart { get; set; } = null!;
        public Videogame? Videogame { get; set; }
    }
}
