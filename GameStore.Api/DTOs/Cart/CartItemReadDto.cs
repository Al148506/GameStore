namespace GameStore.Api.Dtos.Cart
{
    public class CartItemReadDto
    {
        public int Id { get; set; }
        public int VideogameId { get; set; }
        public string VideogameName { get; set; } 
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountedUnitPrice { get; set; }

        public decimal Total { get; set; }
        public decimal TotalDiscounted { get; set; }
    }
}
