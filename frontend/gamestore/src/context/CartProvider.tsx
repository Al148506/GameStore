import React, { useState, useEffect, useCallback } from "react";
import { cartApi } from "../api/cartApi";
import type { CartReadDto } from "../types/cart/cart";
import type {
  CartItemCreateDto,
  CartItemUpdateDto,
} from "../types/cart/cartItem";
import { CartContext } from "./CartContext";
import { useAuth } from "@hooks/useAuth";
import { clearCartStorage } from "@utils/clearCartStorage";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  const [cart, setCart] = useState<CartReadDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const CART_STORAGE_KEY = user ? `shopping-cart-${user.id}` : null;

  // =========================
  // FETCH CART
  // =========================
  const fetchCart = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // =========================
  // INIT CART (login / refresh)
  // =========================
  useEffect(() => {
    if (!user) {
      setCart(null);
      setIsLoading(false);
      return;
    }

    if (CART_STORAGE_KEY) {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
          return;
        } catch {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    }

    fetchCart();
  }, [user, fetchCart, CART_STORAGE_KEY]);

  // =========================
  // PERSIST CART
  // =========================
  useEffect(() => {
    if (!CART_STORAGE_KEY) return;

    if (cart) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cart, CART_STORAGE_KEY]);

  // =========================
  // CART ACTIONS
  // =========================
  const addItem = useCallback(async (item: CartItemCreateDto) => {
    try {
      const updatedCart = await cartApi.addItem({
        videogameId: item.videogameId,
        quantity: item.quantity,
      });
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

  const decreaseItemQuantity = useCallback(
    async (itemId: number) => {
      try {
        await cartApi.decreaseItemQuantity(itemId);
        await fetchCart();
      } catch (error) {
        console.error("Error decreasing item quantity:", error);
      }
    },
    [fetchCart]
  );

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

  const clearCart = useCallback(async () => {
    try {
      await cartApi.clearCart();
      setCart(null);
      clearCartStorage();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  }, []);

  // =========================
  // COUPONS
  // =========================
const applyCoupon = useCallback(
  async (code: string): Promise<CartReadDto> => {
    try {
      setIsLoading(true);
      const updatedCart = await cartApi.applyCoupon(code);
      setCart(updatedCart);
      setCouponError(null);
      return updatedCart; // ✅ éxito
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Cupón inválido o expirado";
      setCouponError(message);
      throw new Error(message); // 🚨 CLAVE
    } finally {
      setIsLoading(false);
    }
  },
  []
);


  // =========================
  // CHECKOUT
  // =========================
  const checkoutCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await cartApi.checkoutCart();
      alert("Compra completada. Orden #" + res.orderId);
      setCart(null);
      clearCartStorage();
    } catch (err) {
      console.error("Checkout error:", err);
      alert("No se pudo completar la compra.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        couponError,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        decreaseItemQuantity,
        clearCart,
        applyCoupon,
        checkoutCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
