using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Infrastructure.Persistence.Videogames.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int CartId { get; set; }           // opcional: referencia al carrito que originó el pedido
        public DateTime CreatedAt { get; set; }
        public decimal TotalAmount { get; set; } // usar decimal(18,2)
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    }
    public enum OrderStatus
    {
        Pending,
        Paid,
        Shipped,
        Cancelled,
        Refunded
    }
}
