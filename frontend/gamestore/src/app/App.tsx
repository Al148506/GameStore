import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "@features/auth/pages/RegisterPage";
import Login from "@features/auth/pages/LoginPage";
import Home from "@features/games/pages/GamesCatalogPage";
import { Cart } from "@features/cart/components/Cart";
import { AuthProvider } from "@features/auth/providers/AuthProvider";
import SuccessPage from "@features/orders/pages/OrderSuccessPage";
import OrderHistory from "@features/orders/pages/OrderHistoryPage";
import CancelPage from "@features/orders/pages/OrderCancelPage";
import ManageUsers from "@features/users/pages/ManageUsersPage";
import { Profile } from "@features/users/pages/ProfilePage";
import ProtectedLayout from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import { AdminDiscountsPage } from "@features/discounts/pages/AdminDiscountsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route element={<ProtectedLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/cart" element={<Cart mode="fullscreen" isOpen />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/cancel" element={<CancelPage />} />
            <Route path="/account-managment" element={<ManageUsers />} />
            <Route path="/discount-managment" element={<AdminDiscountsPage />} />
            <Route path="/profile" element={<Profile />} />
            
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;
