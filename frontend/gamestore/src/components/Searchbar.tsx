import "../styles/searchbar.css";

 export interface Filters {
  searchTerm: string;
  alphabet: string;
  price: string;
  rating: string;
}

interface SearchbarProps {
  filters: Filters;
  onFiltersChange: (newFilters: Filters) => void;
}

export function Searchbar({ filters, onFiltersChange }: SearchbarProps) {
  const updateFilter = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchTerm: "",
      alphabet: "",
      price: "",
      rating: "",
    });
  };

  return (
    <nav className="searchbar" role="navigation" aria-label="Barra de búsqueda">
      <div className="searchbar-container">
        {/* Input de búsqueda */}
        <div className="searchbar-search">
          <span className="search-icon" aria-hidden="true">🔍</span>

          <input
            type="text"
            placeholder="Buscar juegos..."
            className="search-input"
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
            aria-label="Buscar juegos"
          />
        </div>

        {/* Filtros */}
        <div className="searchbar-actions">
          {/* Orden alfabético */}
          <select
            className="sort-select"
            value={filters.alphabet}
            onChange={(e) => updateFilter("alphabet", e.target.value)}
            aria-label="Ordenar alfabéticamente"
          >
            <option value="">Alfabético</option>
            <option value="az">A–Z</option>
            <option value="za">Z–A</option>
          </select>

          {/* Orden por precio */}
          <select
            className="sort-select"
            value={filters.price}
            onChange={(e) => updateFilter("price", e.target.value)}
            aria-label="Ordenar por precio"
          >
            <option value="">Precio</option>
            <option value="low-high">Menor a Mayor</option>
            <option value="high-low">Mayor a Menor</option>
          </select>

          {/* Orden por rating */}
          <select
            className="sort-select"
            value={filters.rating}
            onChange={(e) => updateFilter("rating", e.target.value)}
            aria-label="Ordenar por rating"
          >
            <option value="">Rating</option>
            <option value="rating-desc">Mayor a Menor</option>
          </select>

          {/* Botón limpiar filtros */}
          <button
            className="btn-clear-filters"
            onClick={clearFilters}
            aria-label="Limpiar filtros"
          >
            🔄 Limpiar
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Searchbar;
