import React, { useContext, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

export const CartPage: React.FC = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) throw new Error("CartContext must be used within CartProvider");

  const { cart, fetchCart } = cartContext;

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!cart || cart.Items.length === 0) {
    return <p>Tu carrito está vacío.</p>;
  }

  return (
    <div>
      <h1>Mi Carrito</h1>
      <div>
        {cart.Items.map((item) => (
          <CartItem key={item.Id} item={item} />
        ))}
      </div>
      <CartSummary />
    </div>
  );
};
