import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Cart } from "./components/Cart/Cart";
import { AuthProvider } from "./context/AuthProvider";
import { CartProvider } from "./context/CartProvider";
import SuccessPage from "./pages/Success";
import OrderHistory from "./pages/OrderHistory";
import CancelPage from "./pages/Cancel";
import ManageUsers from "./pages/ManageUsers";
import { Profile } from "@components/User/Profile";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* CartProvider envuelve TODAS las rutas */}
        <CartProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/home" element={<Home />} />
            <Route
              path="/cart"
              element={<Cart mode="fullscreen" isOpen={true} />}
            />

            <Route path="/success" element={<SuccessPage />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/cancel" element={<CancelPage />} />
            <Route path="/account-managment" element={<ManageUsers />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>

          {/* Cart sidebar visible en todas las páginas del sistema */}
          <Cart />
        </CartProvider>
      </Router>
    </AuthProvider>
  );
}
export default App;
