import { Link, useNavigate } from "react-router-dom";
import "../styles/navbarGeneral.css";

export function NavbarGeneral() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar-general">
      <div className="navbar-general-container">
        <Link to="/home" className="nav-logo">
          🎮 GameStore
        </Link>

        <div className="nav-links">
          <Link to="/home">Inicio</Link>
          <Link to="/orders">Mis Compras</Link>
          <Link to="/profile">Mi Cuenta</Link>
          <Link to="/cart">Carrito</Link>
        </div>

        <button className="nav-btn-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default NavbarGeneral;
