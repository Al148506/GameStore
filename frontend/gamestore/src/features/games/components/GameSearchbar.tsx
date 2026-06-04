import { useVideogameOptions } from "../hooks/useVideogameOptions";
import "../../../styles/searchbar.css";
import { CleanIcon } from "@features/cart/components/Icons";
import Select, { type MultiValue } from "react-select";
import { customSelectStyles } from "@shared/constants/selectCustomStyles";

export interface Filters {
  searchTerm: string;
  alphabet: string;
  price: string;
  genreIds: number[];
  platformIds: number[];
}

interface SearchbarProps {
  filters: Filters;
  onFiltersChange: (newFilters: Filters) => void;
}

interface Option {
  value: number;
  label: string;
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
      genreIds: [],
      platformIds: [],
    });
  };

  const { genres, platforms, loading } = useVideogameOptions(true);

  const genreOptions: Option[] = genres.map((g) => ({
    value: g.id,
    label: g.name,
  }));

  const platformOptions: Option[] = platforms.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  function handleMultiSelect(
    key: "genreIds" | "platformIds",
    value: MultiValue<Option>,
  ) {
    const selectedIds = value.map((option) => option.value);
    onFiltersChange({ ...filters, [key]: selectedIds });
  }

  const hasActiveFilters =
    filters.searchTerm !== "" ||
    filters.alphabet !== "" ||
    filters.price !== "" ||
    filters.genreIds.length > 0 ||
    filters.platformIds.length > 0;

  return (
    <nav className="searchbar" role="navigation" aria-label="Barra de búsqueda">
      <div className="searchbar-container">
        {/* Input de búsqueda */}
        <div className="searchbar-search">
          <span className="search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="text"
            placeholder="Buscar juegos..."
            className="search-input"
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
            aria-label="Buscar juegos"
          />
        </div>

        {/* Filtros y ordenamiento */}
        <div className="searchbar-filters">
          {/* Grupo de ordenamiento */}
          <div className="filter-group filter-group--multiselect">
            <div className="select-wrapper">
              <label htmlFor="sort-select" className="select-label">
                Orden Alfabetico
              </label>
              <select
                className="sort-select"
                value={filters.alphabet}
                onChange={(e) => updateFilter("alphabet", e.target.value)}
                aria-label="Ordenar alfabéticamente"
                id="sort-select"
              >
                <option value="">Seleccionar orden</option>
                <option value="az">A–Z</option>
                <option value="za">Z–A</option>
              </select>
            </div>

            <div className="select-wrapper">
              <label htmlFor="sort-select" className="select-label">
                Orden Precio
              </label>
              <select
                className="sort-select"
                value={filters.price}
                onChange={(e) => updateFilter("price", e.target.value)}
                aria-label="Ordenar por precio"
                id="sort-select"
              >
                <option value="">Seleccionar orden</option>
                <option value="low-high">Menor a Mayor</option>
                <option value="high-low">Mayor a Menor</option>
              </select>
            </div>
          </div>

          {/* Grupo de filtros multi-select */}
          <div className="filter-group filter-group--multiselect">
            <div className="select-wrapper">
              <label htmlFor="genreIds" className="select-label">
                Géneros
              </label>
              <Select
                isMulti
                inputId="genreIds"
                name="genreIds"
                options={genreOptions}
                isLoading={loading}
                placeholder="Seleccionar géneros..."
                value={genreOptions.filter((o) =>
                  filters.genreIds.includes(o.value),
                )}
                onChange={(val) => handleMultiSelect("genreIds", val)}
                styles={customSelectStyles}
                classNamePrefix="react-select"
              />
            </div>

            <div className="select-wrapper">
              <label htmlFor="platformIds" className="select-label">
                Plataformas
              </label>
              <Select
                isMulti
                inputId="platformIds"
                name="platformIds"
                options={platformOptions}
                isLoading={loading}
                placeholder="Seleccionar plataformas..."
                value={platformOptions.filter((o) =>
                  filters.platformIds.includes(o.value),
                )}
                onChange={(val) => handleMultiSelect("platformIds", val)}
                styles={customSelectStyles}
                classNamePrefix="react-select"
              />
            </div>
          </div>

          {/* Botón limpiar filtros - solo visible si hay filtros activos */}
          {hasActiveFilters && (
            <button
              className="btn-clear-filters"
              onClick={clearFilters}
              aria-label="Limpiar todos los filtros"
              title="Limpiar filtros"
            >
              <CleanIcon />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Searchbar;
