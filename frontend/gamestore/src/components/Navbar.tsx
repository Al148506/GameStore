import "../styles/navbar.css";

interface NavbarProps {
  onSearch?: (searchTerm: string) => void;
  onSort?: (sortBy: string) => void;
}

export function Navbar({ onSearch, onSort }: NavbarProps) {
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
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Título */}
        <div className="navbar-brand">
          <h1 className="navbar-title">🎮 GameStore</h1>
        </div>

        {/* Barra de búsqueda */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Buscar juegos..."
            className="search-input"
            onChange={handleSearchChange}
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Opciones de ordenamiento */}
        <div className="navbar-actions">
          <select
            className="sort-select"
            onChange={handleSortChange}
            defaultValue=""
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
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
