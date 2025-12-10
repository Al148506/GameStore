import React, { useState, useEffect, useCallback } from "react";
import { cartApi } from "../api/cartApi.ts";
import type { CartReadDto } from "../types/Cart/cart";
import type {
  CartItemCreateDto,
  CartItemUpdateDto,
} from "../types/Cart/cartItem";
import { CartContext } from "./CartContext";
import { useAuth } from "@hooks/useAuth";





const CART_STORAGE_KEY = "shopping-cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartReadDto | null>(() => {
    // ✅ Inicializar desde localStorage
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : null;
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // ✅ Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    if (cart) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cart]);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart", err);
      // Mantener el carrito del localStorage si falla
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // ✅ Sincronizar con servidor cuando cambie el usuario
  useEffect(() => {
    fetchCart();
  }, [user]); // Solo cuando cambia el usuario

  const addItem = useCallback(async (item: CartItemCreateDto) => {
    try {
      const updatedCart = await cartApi.addItem(item);
      console.log("Item added, updated cart:", updatedCart);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
