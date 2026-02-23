import { ClearCartIcon } from "./Icons";
import "../../styles/cart.css";
import { useCart } from "../../hooks/useCart";
import { CartItem } from "./CartItem";
import { useEffect } from "react";
import Navbar from "@components/common/Navbar";
import CartCoupon from "./CartCoupon";

interface CartProps {
  mode?: "sidebar" | "fullscreen";
  isOpen?: boolean;
}

export function Cart({ mode = "sidebar", isOpen = false }: CartProps) {
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

  const CartItemsList = () => (
    <ul>
      {cart?.items?.map((item) => (
        <CartItem
          key={item.id}
          {...item}
          decreaseItemQuantity={decreaseItemQuantity}
          addToCart={() =>
            addItem({
              videogameId: item.videogameId,
              quantity: 1,
            })
          }
        />
      ))}
    </ul>
  );

  const CheckoutButton = () => (
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
  );

  return (
    <>
      {mode === "fullscreen" && <Navbar />}
      <aside className={`cart ${mode} ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>
            {mode === "fullscreen" ? "🛒 Tu Carrito de Compras" : "Tu Carrito"}
          </h2>
        </div>

        {isLoading ? (
          <div className="loading-cart">
            <div className="spinner"></div>
            Cargando carrito...
          </div>
        ) : !cart?.items?.length ? (
          <div className="empty-cart">
            {mode === "fullscreen"
              ? "Tu carrito está vacío. ¡Empieza a comprar!"
              : "Tu carrito está vacío"}
          </div>
        ) : (
          <>
            {mode === "fullscreen" ? (
              <div className="cart-content-wrapper">
                <div className="cart-items-section">
                  <CartItemsList />
                </div>

                <div className="cart-summary-section">
                  <CartCoupon />
                  <div className="cart-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <strong>${cart?.subtotal?.toFixed(2) ?? "0.00"}</strong>
                    </div>
                    {cart?.discountAmount > 0 && (
                      <div className="summary-row discount">
                        <span>Descuento ({cart.appliedCouponCode}):</span>
                        <strong>- ${cart.discountAmount.toFixed(2)}</strong>
                      </div>
                    )}
                    <div className="summary-row">
                      <span>Total:</span>
                      <strong>${cart?.total?.toFixed(2) ?? "0.00"}</strong>
                    </div>
                  </div>
                  <CheckoutButton />
                </div>
              </div>
            ) : (
              <>
                <CartItemsList />
                <div className="cart-summary">
                  <div className="summary-row">
                    {cart?.appliedCouponCode &&
                     <span>Cupon aplicado: </span>}
                     <strong>{cart.appliedCouponCode}</strong>
                    </div>
                  <div className="summary-row">
                    <span>Total:</span>
                    <strong>${cart?.total?.toFixed(2) ?? "0.00"}</strong>
                  </div>
                </div>
                <div className="cart-copun">
                  <CartCoupon />
                </div>
                <CheckoutButton />
              </>
            )}
          </>
        )}
      </aside>
    </>
  );
}
