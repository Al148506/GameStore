namespace GameStore.Api.Dtos.Cart
{
    public class CartCreateDto
    {
        public string UserId { get; set; } = string.Empty;
        public List<CartItemCreateDto> Items { get; set; } = new();
        public DateTime CreatedAt { get; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; } = DateTime.UtcNow;

        public bool IsCheckedOut { get; } = false;
    }
}
