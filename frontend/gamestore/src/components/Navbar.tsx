import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "../styles/navbarGeneral.css";
import Button from "./Button";
import Swal from "sweetalert2";

export function NavbarGeneral() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      setIsMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar-general">
      <div className="navbar-general-container">
        <Link to="/home" className="nav-logo">
          🎮 GameStore
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-icon">{isMenuOpen ? "✕" : "☰"}</span>
        </button>

        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          <Link
            to="/home"
            className={location.pathname === "/home" ? "active" : ""}
            onClick={handleLinkClick}
          >
            Inicio
          </Link>
          <Link
            to="/order-history"
            className={location.pathname === "/order-history" ? "active" : ""}
            onClick={handleLinkClick}
          >
            Mis Compras
          </Link>

          <Link
            to="/cart"
            className={location.pathname === "/cart" ? "active" : ""}
            onClick={handleLinkClick}
          >
            Carrito
          </Link>

          <Link
            to="/profile"
            className={location.pathname === "/profile" ? "active" : ""}
            onClick={handleLinkClick}
          >
            Mi Cuenta
          </Link>
          <Link
            to="/account-managment"
            className={
              location.pathname === "/account-managment" ? "active" : ""
            }
            onClick={handleLinkClick}
          >
            Manejo de cuentas
          </Link>
        </div>

        <Button
          text="Cerrar sesión"
          onClick={handleLogout}
          variant="closesession"
        />
      </div>
    </nav>
  );
}

export default NavbarGeneral;
