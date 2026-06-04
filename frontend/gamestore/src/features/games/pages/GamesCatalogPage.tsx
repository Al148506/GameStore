import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVideogames } from "../hooks/useVideogames";
import { Pagination } from "@shared/components/Pagination";
import type { VideogameDto } from "../types/videogame";
import { Searchbar } from "../components/GameSearchbar";
import { VideogameDetailsModal } from "../components/VideogameDetailsModal";
import { VideogamesGrid } from "../components/VideogamesGrid";
import { VideogameFormModal } from "../components/VideogameFormModal";
import NavbarGeneral from "@shared/components/Navbar";
import type { Filters } from "../components/GameSearchbar";
import "../../../styles/home.css";
import "../../../styles/modal.css";
import Button from "@shared/components/Button";
import { CartButton } from "@features/cart/components/CartButton";
import { Cart } from "@features/cart/components/Cart";
import { useAuth } from "@features/auth/hooks/useAuth";

export function Home() {
  const navigate = useNavigate();
  const pageSize = 5;
  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    alphabet: "",
    price: "",
    genreIds: [],
    platformIds: [],
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
  const { isAdmin } = useAuth();
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
        {isAdmin && (
          <Button
            text={<>Agregar videojuego</>}
            variant="create"
            onClick={() => setShowCreateModal(true)}
          />
        )}
        <CartButton onClick={() => setIsOpen(!isOpen)} />
        <Cart isOpen={isOpen} mode="sidebar" onClose={() => setIsOpen(false)} />

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
