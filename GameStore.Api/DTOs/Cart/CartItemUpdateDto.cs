using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.DTOs.Cart
{
    public class CartItemUpdateDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor o igual a 1.")]
        public int Quantity { get; set; }
    }
}
