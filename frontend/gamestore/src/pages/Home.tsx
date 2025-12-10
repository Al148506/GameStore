import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVideogames } from "@hooks/useVideogames";
import { Pagination } from "@components/Pagination";
import type { VideogameDto } from "../types/Videogame/videogame";
import { Searchbar } from "@components/Searchbar";
import { VideogameDetailsModal } from "@components/Videogame/VideogameDetailsModal";
import { VideogamesGrid } from "@components/Videogame/VideogamesGrid";
import { VideogameFormModal } from "@components/Videogame/VideogameFormModal";
import NavbarGeneral from "@components/Navbar";
import type { Filters } from "@components/Searchbar";
import "../styles/home.css";
import "../styles/modal.css";
import Button from "@components/Button";
import { CartButton } from "@components/Cart/CartButton";
import { Cart } from "@components/Cart/Cart";

export function Home() {
  const navigate = useNavigate();
  const pageSize = 5;
  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    alphabet: "",
    price: "",
    genreIds: [],
    platformIds:  [],
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <NavbarGeneral />
      {/* 👇 Navbar fuera del container */}
      <Searchbar filters={filters} onFiltersChange={setFilters} />
      <div className="videogames-list-container">
      
        <Button
          text={<>Agregar videojuego</>}
          variant="create"
          onClick={() => setShowCreateModal(true)}
        />
        <CartButton onClick={() => setIsOpen(!isOpen)} />
        <Cart isOpen={isOpen} mode="sidebar" />

        <VideogamesGrid
          games={videogames}
          onCardClick={handleOpenModal}
          onEdit={setEditingGame}
          onDelete={deleteVideogame}
          loading={loading}
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
