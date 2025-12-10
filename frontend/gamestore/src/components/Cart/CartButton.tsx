import { CartIcon } from "./Icons";
import "../../styles/cart.css";
import { useCart } from "../../hooks/useCart";

export function CartButton({ onClick }: { onClick: () => void }) {
  const { cart } = useCart();

  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <button className="cart-button" onClick={onClick}>
      <CartIcon />
      {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
    </button>
  );
}
