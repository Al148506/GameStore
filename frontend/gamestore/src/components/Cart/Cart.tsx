import { CartIcon, ClearCartIcon } from "./Icons";
import "../../styles/cart.css";
import { useCart } from "../../hooks/useCart";
import { CartItem } from "./CartItem";
import { useState, useEffect } from "react";

export function Cart() {
  const {
    cart,
    isLoading,
    addItem,
    fetchCart,
    decreaseItemQuantity,
    checkoutCart,
  } = useCart();

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

  return (
    <>
      <button className="cart-button" onClick={() => setIsOpen(!isOpen)}>
        <CartIcon />
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </button>

      <aside className={`cart ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Tu Carrito</h2>
        </div>

        {isLoading ? (
          <div className="loading-cart">Cargando carrito...</div>
        ) : !cart?.items?.length ? (
          <div className="empty-cart">Tu carrito está vacío</div>
        ) : (
          <>
            <ul>
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  {...item}
                  decreaseItemQuantity={decreaseItemQuantity}
                  addToCart={() =>
                    addItem({
                      videogameId: item.videogameId,
                      quantity: 1,
                      unitPrice: item.unitPrice,
                    })
                  }
                />
              ))}
            </ul>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Total:</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>
            </div>

            <button
              onClick={checkoutCart}
              className="checkout-button"
              disabled={isLoading}
            >
              {isLoading ? (
                "Procesando..."
              ) : (
                <>
                  <ClearCartIcon />
                  Finalizar Compra
                </>
              )}
            </button>
          </>
        )}
      </aside>
    </>
  );
}
