using GameStore.Api.Dtos.Cart;

namespace GameStore.Api.DTOs.Cart
{
    public class CartReadDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsCheckedOut { get; set; }
        public List<CartItemReadDto> Items { get; set; } = new();
    }
}
