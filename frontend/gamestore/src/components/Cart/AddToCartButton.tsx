import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import type { CartItemCreateDto } from "../../types/Cart/cartItem";

interface Props {
  videogameId: number;
  unitPrice: number;
}

export const AddToCartButton: React.FC<Props> = ({ videogameId, unitPrice }) => {
  const cartContext = useContext(CartContext);
  if (!cartContext) throw new Error("CartContext must be used within CartProvider");

  const { addItem } = cartContext;

  const handleAdd = async () => {
    const item: CartItemCreateDto = {
      VideogameId: videogameId,
      Quantity: 1,
      UnitPrice: unitPrice,
    };
    await addItem(item);
  };

  return <button onClick={handleAdd}>Agregar al carrito</button>;
};
