using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Infrastructure.Persistence.Videogames.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        public int VideogameId { get; set; }     // o ProductId, según tu modelo
        public Videogame? Videogame { get; set; } // navegación opcional

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
