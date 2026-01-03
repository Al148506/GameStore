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
import { Cart } from "./components/cart/Cart";
import { AuthProvider } from "./context/AuthProvider";
import SuccessPage from "./pages/Success";
import OrderHistory from "./pages/OrderHistory";
import CancelPage from "./pages/Cancel";
import ManageUsers from "./pages/ManageUsers";
import { Profile } from "./pages/Profile";
import ProtectedLayout from "./ProtectedLayout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/cart" element={<Cart mode="fullscreen" isOpen />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/cancel" element={<CancelPage />} />
            <Route path="/account-managment" element={<ManageUsers />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;
