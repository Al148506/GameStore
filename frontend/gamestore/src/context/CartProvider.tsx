import React, { useState, useEffect, useCallback } from "react";
import { cartApi } from "../api/cartApi";
import type { CartReadDto } from "../types/Cart/cart";
import type { CartItemCreateDto, CartItemUpdateDto } from "../types/Cart/cartItem";
import { useAuth } from "../hooks/useAuth";
import { CartContext } from "./CartContext";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartReadDto | null>(null);

  // Obtener el carrito activo del usuario
  const fetchCart = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart(null); // No hay carrito activo
    }
  }, [user?.id]);

  // Agregar un ítem al carrito activo
  const addItem = async (item: CartItemCreateDto) => {
    if (!user?.id) return;
    try {
      const updatedCart = await cartApi.addItem(item);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // Actualizar cantidad de un ítem
  const updateItem = async (itemId: number, item: CartItemUpdateDto) => {
    try {
      await cartApi.updateItem(itemId, item);
      await fetchCart();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Eliminar un ítem
  const removeItem = async (itemId: number) => {
    try {
      await cartApi.deleteItem(itemId);
      await fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Checkout del carrito
  const checkoutCart = async () => {
    if (!cart) return;
    try {
      await cartApi.checkoutCart(cart.Id);
      setCart(null); // El carrito ya fue finalizado
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        checkoutCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
