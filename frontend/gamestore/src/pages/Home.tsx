import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVideogames } from "@hooks/useVideogames";
import { Pagination } from "@components/pagination";
import type { VideogameDto } from "../types/Videogame/videogame";
import { Searchbar } from "@components/Searchbar";
import { VideogameDetailsModal } from "@components/Videogame/VideogameDetailsModal";
import { VideogamesGrid } from "@components/Videogame/VideogamesGrid";
import { VideogameFormModal } from "@components/Videogame/VideogameFormModal";
import NavbarGeneral from "@components/Navbar";
import type { Filters } from "@components/Searchbar";
import "../styles/home.css";
import "../styles/modal.css";

export function Home() {
  const navigate = useNavigate();
  const pageSize = 6;
  const {
    videogames,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    deleteVideogame,
    updateVideogame,
    createVideogame,
  } = useVideogames(pageSize);

  const [selectedGame, setSelectedGame] = useState<VideogameDto | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingGame, setEditingGame] = useState<VideogameDto | null>(null);
  const [showFormModal, setShowCreateModal] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    alphabet: "",
    price: "",
    rating: "",
  });

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleOpenModal = (game: VideogameDto) => {
    setSelectedGame(game);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGame(null);
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // 👇 Filtrar y ordenar juegos
  const filteredAndSortedGames = videogames
    .filter((game) =>
      game.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Primero ordenar por alfabeto si está activo
      if (filters.alphabet) {
        if (filters.alphabet === "az") {
          return a.name.localeCompare(b.name);
        }
        if (filters.alphabet === "za") {
          return b.name.localeCompare(a.name);
        }
      }

      // Luego ordenar por precio si está activo
      if (filters.price) {
        if (filters.price === "low-high") {
          return a.price - b.price;
        }
        if (filters.price === "high-low") {
          return b.price - a.price;
        }
      }

      // Finalmente ordenar por rating si está activo
      // if (filters.rating) {
      //   if (filters.rating === "rating-desc") {
      //     return (b.rating || 0) - (a.rating || 0);
      //   }
      // }

      return 0; // Sin ordenamiento
    });

  return (
    <>
      <NavbarGeneral />
      {/* 👇 Navbar fuera del container */}
      <Searchbar filters={filters} onFiltersChange={setFilters} />
      <div className="videogames-list-container">
        {/* ✅ Botón flotante para agregar */}
        <button
          className="fab-button"
          onClick={() => setShowCreateModal(true)}
          title="Agregar videojuego"
        >
          +
        </button>
        <VideogamesGrid
          games={filteredAndSortedGames}
          onCardClick={handleOpenModal}
          onEdit={setEditingGame}
          onDelete={deleteVideogame}
        />
        <VideogameFormModal
          isOpen={showFormModal}
          mode="create"
          onCreate={createVideogame}
          onClose={() => setShowCreateModal(false)}
        />

        {editingGame && (
          <VideogameFormModal
            isOpen={true}
            mode="edit"
            gameToEdit={editingGame}
            onClose={() => setEditingGame(null)}
            onSave={updateVideogame}
          />
        )}

        <div className="pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        <VideogameDetailsModal
          game={selectedGame}
          isOpen={showModal}
          onClose={handleCloseModal}
        />
      </div>
    </>
  );
}

export default Home;
