using GameStore.Api.Dtos.Cart;

namespace GameStore.Api.DTOs.Payment
{
    public class CreateCheckoutSessionDto
    {
        public List<CartItemReadDto> Items { get; set; } = new();

    }
}
