import { createContext } from "react";
import type { CartReadDto } from "../types/Cart/cart";
import type { CartItemCreateDto, CartItemUpdateDto } from "../types/Cart/cartItem";

export interface CartContextType {
  cart: CartReadDto | null;
  fetchCart: () => Promise<void>;
  addItem: (item: CartItemCreateDto) => Promise<void>;
  updateItem: (itemId: number, item: CartItemUpdateDto) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  checkoutCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
