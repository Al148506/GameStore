import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import type {
  CartItemReadDto,
  CartItemUpdateDto,
} from "../../types/Cart/cartItem";

interface Props {
  item: CartItemReadDto;
}

export const CartItem: React.FC<Props> = ({ item }) => {
  const cartContext = useContext(CartContext);
  if (!cartContext)
    throw new Error("CartContext must be used within CartProvider");

  const { updateItem, removeItem } = cartContext;
  const [quantity, setQuantity] = useState(item.quantity);

  const handleUpdate = async () => {
    const updateData: CartItemUpdateDto = { quantity: quantity };
    await updateItem(item.id, updateData);
  };

  const handleRemove = async () => {
    await removeItem(item.id);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "1rem",
      }}
    >
      <span>{item.videogameName}</span>
      <span>${item.unitPrice}</span>
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        style={{ width: "60px" }}
      />
      <span>${item.total}</span>
      <button onClick={handleUpdate}>Actualizar</button>
      <button onClick={handleRemove}>Eliminar</button>
    </div>
  );
};
