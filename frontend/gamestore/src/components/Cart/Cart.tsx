import { ClearCartIcon } from "./Icons";
import "../../styles/cart.css";
import { useCart } from "../../hooks/useCart";
import { CartItem } from "./CartItem";
import { useEffect } from "react";
import Navbar from "@components/Navbar";
interface CartProps {
  mode?: "sidebar" | "fullscreen";
   isOpen?: boolean;
}
export function Cart({mode, isOpen}: CartProps) {
  const {
    cart,
    isLoading,
    addItem,
    fetchCart,
    decreaseItemQuantity,
    checkoutCart,
  } = useCart();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalPrice =
    cart?.items?.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    ) || 0;

  return (
    <>
      {mode === "fullscreen" && <Navbar />}
      <aside className={`cart ${mode} ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>{mode === "fullscreen" ? "🛒 Tu Carrito de Compras" : "Tu Carrito"}</h2>
        </div>

        {isLoading ? (
          <div className="loading-cart">
            <div className="spinner"></div>
            Cargando carrito...
          </div>
        ) : !cart?.items?.length ? (
          <div className="empty-cart">
            {mode === "fullscreen" ? "Tu carrito está vacío. ¡Empieza a comprar!" : "Tu carrito está vacío"}
          </div>
        ) : (
          <>
            {mode === "fullscreen" ? (
              <div className="cart-content-wrapper">
                <div className="cart-items-section">
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
                </div>

                <div className="cart-summary-section">
                  <div className="cart-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <strong>${totalPrice.toFixed(2)}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Envío:</span>
                      <span>Gratis</span>
                    </div>
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
                </div>
              </div>
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
          </>
        )}
      </aside>
    </>
  );
}

