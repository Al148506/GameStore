import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVideogames } from "@hooks/useVideogames";
import { Pagination } from "@components/pagination";
import type { VideogameDto } from "../types/videogame";
import { Navbar } from "@components/Navbar";
import "../styles/home.css";
import "../styles/modal.css";
import { EditVideogameModal } from "@components/EditVideogameModal";
import { VideogameDetailsModal } from "@components/VideogameDetailsModal";
import { VideogamesGrid } from "@components/VideogamesGrid";
import { CreateVideogameModal } from "@components/CreateVideogameModal";

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
  const [searchTerm, setSearchTerm] = useState<string>(""); // 👈 Estado para búsqueda
  const [sortBy, setSortBy] = useState<string>(""); // 👈 Estado para ordenamiento
  const [editingGame, setEditingGame] = useState<VideogameDto | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

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

  // 👇 Función para manejar búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
  };

  // 👇 Función para manejar ordenamiento
  const handleSort = (sortType: string) => {
    setSortBy(sortType);
  };

  // 👇 Filtrar y ordenar juegos
  const filteredAndSortedGames = videogames
    .filter((game) => game.name.toLowerCase().includes(searchTerm))
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        // case "rating-desc":
        //   return b.rating - a.rating;
        default:
          return 0;
      }
    });

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      {/* 👇 Navbar fuera del container */}
      <Navbar onSearch={handleSearch} onSort={handleSort} />
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
         <CreateVideogameModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={createVideogame}
        />

        {editingGame && (
          <EditVideogameModal
            game={editingGame}
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
