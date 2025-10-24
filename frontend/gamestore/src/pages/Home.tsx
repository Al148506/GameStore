import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVideogames } from "@hooks/useVideogames";
import { Pagination } from "@components/pagination";
import type { VideogameDto } from "../types/videogame";
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
  } = useVideogames(pageSize);

  const [selectedGame, setSelectedGame] = useState<VideogameDto | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
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
    <div className="videogames-list-container">
      <div className="videogames-grid">
        {videogames.map((game) => (
          <div
            key={game.id}
            className="videogame-card"
            onClick={() => handleOpenModal(game)}
          >
            <img
              src={game.imageUrl}
              alt={game.name}
              className="game-card-image"
            />
            <div className="game-card-content">
              <h2 className="game-title">{game.name}</h2>
              <p>
                <strong>Precio:</strong> ${game.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {showModal && selectedGame && (
        <div id="modal" className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="modal-close" onClick={handleCloseModal}>
                ✖
              </button>
              <img
                src={selectedGame.imageUrl}
                alt={selectedGame.name}
                className="modal-image"
              />
            </div>
            <div className="modal-body">
              <h2 className="modal-title">{selectedGame.name}</h2>
              <p className="modal-description">{selectedGame.description}</p>
              <div className="modal-info-grid">
                <div className="info-item">
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(selectedGame.releaseDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="info-item">
                  <p>
                    <strong>Precio:</strong> ${selectedGame.price.toFixed(2)}
                  </p>
                </div>
                <div className="info-item">
                  <p>
                    <strong>Stock:</strong> {selectedGame.stock}
                  </p>
                </div>
                <div className="info-item">
                  <p>
                    <strong>Rating:</strong> {selectedGame.rating}
                  </p>
                </div>
              </div>

              <div className="modal-tags">
                <span className="tags-label">Géneros</span>
                <div className="tags-container">
                  {selectedGame.genres.map((genre, index) => (
                    <span key={index} className="tag">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              <div className="modal-tags">
                <span className="tags-label">Plataformas</span>
                <div className="tags-container">
                  {selectedGame.platforms.map((platform, index) => (
                    <span key={index} className="tag secondary">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
