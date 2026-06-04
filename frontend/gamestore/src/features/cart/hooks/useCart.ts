import { useContext } from "react";
import { CartContext } from "../providers/CartContext";
import type { CartContextType } from "../providers/CartContext";

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};
