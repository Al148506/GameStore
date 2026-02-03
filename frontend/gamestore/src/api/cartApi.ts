import api from "./axios";
import type { CartReadDto } from "../types/cart/cart";
import type {
  CartItemCreateDto,
  CartItemUpdateDto,
} from "../types/cart/cartItem";

export const cartApi = {
  // Obtiene (o crea) el carrito activo del usuario autenticado
  getCart: async (): Promise<CartReadDto> => {
    const res = await api.get("cart/myCart");
    return res.data;
  },

  // Checkout del carrito activo
  checkoutCart: async (): Promise<{ orderId: number; message: string }> => {
    const res = await api.post("cart/checkout");
    return res.data;
  },

  // Limpia todos los ítems del carrito activo
  clearCart: async (): Promise<void> => {
    await api.delete("cart/clear");
  },

  // Agrega un ítem al carrito activo
  addItem: async (item: CartItemCreateDto): Promise<CartReadDto> => {
    const res = await api.post("cart/items", {
      videogameId: item.videogameId,
      quantity: item.quantity,
    });
    return res.data;
  },

  // Actualiza la cantidad de un ítem
  updateItem: async (
    itemId: number,
    item: CartItemUpdateDto,
  ): Promise<void> => {
    await api.put(`cart/items/${itemId}`, item);
  },

  // Disminuye la cantidad de un ítem en 1
  decreaseItemQuantity: async (itemId: number): Promise<void> => {
    await api.patch(`cart/items/decrease/${itemId}`);
  },

  // Elimina un ítem del carrito
  deleteItem: async (itemId: number): Promise<void> => {
    await api.delete(`cart/items/${itemId}`);
  },

  applyCoupon: async (couponCode: string): Promise<CartReadDto> => {
  const res = await api.post("cart/apply-coupon", { couponCode });
  return res.data;
},

};
