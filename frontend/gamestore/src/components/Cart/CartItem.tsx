import type { CartItemReadDto } from "../../types/cart/cartItem";
import "../../styles/cartItem.css";

interface CartItemProps extends CartItemReadDto {
  addToCart: () => void;
  decreaseItemQuantity: (itemId: number) => Promise<void>;
}

export function CartItem({
  id,
  videogameName,
  unitPrice,
  discountedUnitPrice,
  quantity,
  addToCart,
  decreaseItemQuantity,
}: CartItemProps) {
  const hasDiscount = discountedUnitPrice < unitPrice;
  const displayPrice = hasDiscount ? discountedUnitPrice : unitPrice;

  return (
    <li className="cart-item">
      <div className="cart-item-header">
        <h3 className="cart-item-title">{videogameName}</h3>

        <div className="cart-item-pricing">
          {hasDiscount && (
            <span className="cart-item-price--original">
              ${unitPrice.toFixed(2)}
            </span>
          )}
          <span className={`cart-item-price${hasDiscount ? '--discounted' : ''}`}>
            ${displayPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <footer className="cart-item-footer">
        <span className="cart-item-quantity">
          Cantidad: <strong>{quantity}</strong>
        </span>

        <div className="cart-item-controls">
          <button
            className="cart-item-btn cart-item-btn--decrease"
            onClick={() => decreaseItemQuantity(id)}
            aria-label="Disminuir cantidad"
          >
            −
          </button>

          <button
            className="cart-item-btn cart-item-btn--increase"
            onClick={addToCart}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </footer>
    </li>
  );
}