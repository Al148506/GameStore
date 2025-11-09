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
        public decimal Total { get; set; }

        public Cart? Cart { get; set; }
        public Videogame? Videogame { get; set; }
    }
}
