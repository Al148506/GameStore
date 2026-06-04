import { Navigate, Outlet } from "react-router-dom";
import { CartProvider } from "@features/cart/providers/CartProvider";
import { useAuth } from "@features/auth/hooks/useAuth";

const ProtectedLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <CartProvider>
      <Outlet />
    </CartProvider>
  );
};

export default ProtectedLayout;
