import api from "./axios";
import type { CartCreateDto, CartReadDto } from "../types/cart/cart";
import type {
  CartItemCreateDto,
  CartItemUpdateDto,
} from "../types/cart/cartItem";

export const cartApi = {
  // Obtiene el carrito activo del usuario autenticado
  getCart: async (): Promise<CartReadDto> => {
    const res = await api.get("/Cart/myCart");
    return res.data;
  },

  // Crea un carrito nuevo
  createCart: async (data: CartCreateDto): Promise<CartReadDto> => {
    const res = await api.post("/Cart", data);
    return res.data;
  },

  // Marca el carrito como checkout
  checkoutCart: async () => {
    const res = await api.post("/payments/create-payment-link");
    return res; // <-- FUNDAMENTAL
  },

  //Disminuye la cantidad de un ítem en el carrito
  decreaseItemQuantity: async (itemId: number): Promise<void> => {
    await api.patch(`/CartItem/decrease/${itemId}`);
  },

  // Elimina un carrito
  deleteCart: async (cartId: number): Promise<void> => {
    await api.delete(`Cart/${cartId}`);
  },

  // Agrega un ítem al carrito activo del usuario
  addItem: async (item: CartItemCreateDto): Promise<CartReadDto> => {
    const res = await api.post("CartItem/items", item);
    return res.data;
  },

  // Actualiza un ítem específico del carrito
  updateItem: async (
    itemId: number,
    item: CartItemUpdateDto
  ): Promise<void> => {
    await api.put(`CartItem/items/${itemId}`, item);
  },

  // Elimina un ítem específico del carrito
  deleteItem: async (itemId: number): Promise<void> => {
    await api.delete(`CartItem/items/${itemId}`);
  },
};
