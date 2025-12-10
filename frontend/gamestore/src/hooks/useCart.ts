import { useContext } from "react";
import { CartContext, type CartContextType } from "../context/CartContext";

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};
