import { Navigate, Outlet } from "react-router-dom";
import { CartProvider } from "./context/CartProvider";
import { useAuth } from "./hooks/useAuth";
import { Cart } from "./components/cart/Cart";

const ProtectedLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <CartProvider>
      <Outlet />
      <Cart /> {/* sidebar */}
    </CartProvider>
  );
};

export default ProtectedLayout;
