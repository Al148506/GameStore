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
  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    alphabet: "",
    price: "",
    rating: "",
  });
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
  } = useVideogames(filters, pageSize);

  const [selectedGame, setSelectedGame] = useState<VideogameDto | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingGame, setEditingGame] = useState<VideogameDto | null>(null);
  const [showFormModal, setShowCreateModal] = useState<boolean>(false);

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
          games={videogames}
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
