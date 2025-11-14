import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "../../styles/cartSidebar.css";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const cartContext = useContext(CartContext);
  if (!cartContext)
    throw new Error("CartSidebar must be used within a CartProvider");

  const { cart, removeItem } = cartContext;

  const total = cart?.Items.reduce((sum, item) => sum + item.Total, 0) ?? 0;

  return (
    <>
      {/* Fondo oscuro para cuando el carrito esté abierto */}
      {isOpen && <div className="cart-overlay" onClick={onClose}></div>}

      <aside className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Tu carrito</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {(!cart || cart.Items.length === 0) ? (
          <p className="empty-cart">Tu carrito está vacío.</p>
        ) : (
          <>
            <ul className="cart-items-list">
              {cart.Items.map((item) => (
                <li key={item.Id} className="cart-item">
                  <div className="item-info">
                    <strong>{item.VideogameName}</strong>
                    <p>Cantidad: {item.Quantity}</p>
                    <p>${item.Total.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.Id)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-summary">
              <h4>Total: ${total.toFixed(2)}</h4>
              <button className="checkout-btn">Finalizar compra</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
