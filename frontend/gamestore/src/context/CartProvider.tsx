import React, { useState, useEffect, useCallback } from "react";
import { cartApi } from "../api/cartApi.ts";
import type { CartReadDto } from "../types/cart/cart.ts";
import type {
  CartItemCreateDto,
  CartItemUpdateDto,
} from "../types/cart/cartItem.ts";
import { CartContext } from "./CartContext.ts";
import { useAuth } from "@hooks/useAuth";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [cart, setCart] = useState<CartReadDto | null>(null);
  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setCart(null);
      setIsLoading(false);
      return;
    }
    // 🟢 Usuario logueado → intentar cargar cache
    const CART_STORAGE_KEY = `shopping-cart-${user.id}`;
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
        setIsLoading(false);
        return;
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
    // 🟢 Si no hay cache, ir al backend
    fetchCart();
  }, [user, fetchCart]);

  // ✅ Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    if (!user) return;
    const CART_STORAGE_KEY = `shopping-cart-${user.id}`;
    if (cart) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cart, user]);

  const addItem = useCallback(async (item: CartItemCreateDto) => {
    try {
      const updatedCart = await cartApi.addItem(item);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }, []);

  const updateItem = useCallback(
    async (itemId: number, item: CartItemUpdateDto) => {
      try {
        await cartApi.updateItem(itemId, item);
        await fetchCart();
      } catch (error) {
        console.error("Error updating item:", error);
      }
    },
    [fetchCart]
  );

  const decreaseItemQuantity = useCallback(async (itemId: number) => {
    try {
      await cartApi.decreaseItemQuantity(itemId);
      await fetchCart();
    } catch (error) {
      console.error("Error decreasing item quantity:", error);
    }
  }, []);

  const removeItem = useCallback(
    async (itemId: number) => {
      try {
        await cartApi.deleteItem(itemId);
        await fetchCart();
      } catch (error) {
        console.error("Error removing item:", error);
      }
    },
    [fetchCart]
  );

  const checkoutCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await cartApi.checkoutCart();
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("No se pudo iniciar el pago.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart(null);
    Object.keys(localStorage)
      .filter((key) => key.startsWith("shopping-cart-"))
      .forEach((key) => localStorage.removeItem(key));
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        checkoutCart,
        decreaseItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
