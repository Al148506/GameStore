import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { FaShoppingCart } from "react-icons/fa";
interface NavbarProps {
  onSearch?: (searchTerm: string) => void;
  onSort?: (sortBy: string) => void;
  onToggleCart?: () => void; // 👈 nuevo prop
}

export function Navbar({ onSearch, onSort, onToggleCart }: NavbarProps) {
  const navigate = useNavigate();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onSort) {
      onSort(e.target.value);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    // Redirige sin recargar la página
    navigate("/login");
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Navegación principal">
      <div className="navbar-container">
        {/* Logo/Título */}
        <div className="navbar-brand">
          <h1 className="navbar-title">
            <span className="logo-icon">🎮</span>
            <span className="logo-text">GameStore</span>
          </h1>
        </div>

        {/* Barra de búsqueda */}
        <div className="navbar-search">
          <span className="search-icon search-icon-left">🔍</span>
          <input
            type="text"
            placeholder="Buscar juegos..."
            className="search-input"
            onChange={handleSearchChange}
            aria-label="Buscar juegos"
          />
        </div>

        {/* Opciones de ordenamiento */}
        <div className="navbar-actions">
          <select
            className="sort-select"
            onChange={handleSortChange}
            defaultValue=""
            aria-label="Ordenar juegos"
          >
            <option value="" disabled>
              Ordenar por
            </option>
            <option value="name-asc">A-Z</option>
            <option value="name-desc">Z-A</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="rating-desc">Rating: Mayor a Menor</option>
          </select>

          {/* Botón de logout */}
          <button
            className="btn-logout"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
          >
            <span className="logout-text">Cerrar Sesión</span>
          </button>
          <button
            className="btn-cart"
            onClick={onToggleCart}
            aria-label="Abrir carrito de compras"
          >
            <FaShoppingCart size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
