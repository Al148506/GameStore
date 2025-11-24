import { CartIcon, ClearCartIcon } from "./Icons";
import "../../styles/cart.css";
import { useCart } from "../../hooks/useCart";
import type { CartItemReadDto } from "../../types/Cart/cartItem";
import { useState, useEffect } from "react";

function CartItem({
  videogameName,
  unitPrice,
  quantity,
  addToCart,
}: CartItemReadDto & { addToCart: () => void }) {
  return (
    <li>
      <div>
        <strong>{videogameName}</strong>
        <span>${unitPrice.toFixed(2)}</span>
      </div>
      <footer>
        <small>Cantidad: {quantity}</small>
        <button onClick={addToCart}>+</button>
      </footer>
    </li>
  );
}

export function Cart() {
  const { cart, isLoading, checkoutCart, addItem, fetchCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice =
    cart?.items?.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    ) || 0;

  const handleToggle = () => setIsOpen(prevState => !prevState);


  return (
    <>
      <button className="cart-button" onClick={handleToggle}>
        <CartIcon />
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </button>

      <aside className={`cart ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Tu Carrito</h2>
        </div>

        {isLoading ? (
          <div className="loading-cart">
            <p>Cargando carrito...</p>
          </div>
        ) : !cart?.items || cart.items.length === 0 ? (
          <div className="empty-cart">
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <ul>
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  addToCart={() =>
                    addItem({
                      videogameId: item.videogameId,
                      quantity: 1,
                      unitPrice: item.unitPrice,
                    })
                  }
                  {...item}
                />
              ))}
            </ul>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Total:</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>
            </div>

            <button onClick={checkoutCart} className="checkout-button">
              <ClearCartIcon />
              Finalizar Compra
            </button>
          </>
        )}
      </aside>
    </>
  );
}
