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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirigir la raíz hacia /login */}
          <Route path="/" element={<Navigate to="/login" />} />
          {/* Login Route */}

          <Route path="/login" element={<Login />} />
          {/* Register Route */}
          <Route path="/register" element={<Register />} />

          {/* Home Route */}
          <Route
            path="/home"
            element={
              <CartProvider>
                <Home />
                 <Cart></Cart>
              </CartProvider>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
