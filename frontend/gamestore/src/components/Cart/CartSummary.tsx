import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";

export const CartSummary: React.FC = () => {
  const cartContext = useContext(CartContext);
  if (!cartContext) throw new Error("CartContext must be used within CartProvider");

  const { cart, checkoutCart } = cartContext;

  if (!cart) return null;

  const total = cart.Items.reduce((sum, item) => sum + item.Total, 0);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>Total: ${total.toFixed(2)}</h3>
      <button onClick={checkoutCart}>Finalizar Compra</button>
    </div>
  );
};

