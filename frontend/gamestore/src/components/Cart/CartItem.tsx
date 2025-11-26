import type { CartItemReadDto } from "../../types/Cart/cartItem";
import "../../styles/cartItem.css";
interface CartItemProps extends CartItemReadDto {
  addToCart: () => void;
  decreaseItemQuantity: (itemId: number) => Promise<void>;
}

export function CartItem({ 
  id, 
  videogameName, 
  unitPrice, 
  quantity, 
  addToCart, 
  decreaseItemQuantity 
}: CartItemProps) {
  return (
    <li>
      <div>
        <strong>{videogameName}</strong>
        <span>${unitPrice.toFixed(2)}</span>
      </div>

      <footer>
        <small>Cantidad: {quantity}</small>
        <button className="decrement" onClick={() => decreaseItemQuantity(id)}>
          -
        </button>
        <button className="increment" onClick={addToCart}>
          +
        </button>
      </footer>
    </li>
  );
}
