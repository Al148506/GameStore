namespace GameStore.Api.DTOs.Order
{
    public class OrderItemDto
    {
        public int VideogameId { get; set; }
        public string? VideogameName { get; set; } // opcional
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
