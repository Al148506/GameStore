import type { VideogameDto } from "../../types/videogame/videogame";
import "../../styles/modal.css";

interface VideogameDetailsModalProps {
  game: VideogameDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VideogameDetailsModal({
  game,
  isOpen,
  onClose,
}: VideogameDetailsModalProps) {
  if (!isOpen || !game) return null;

  return (
    <div id="modal" className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>
            ✖
          </button>
          <img src={game.imageUrl} alt={game.name} className="modal-image" />
        </div>
        <div className="modal-body">
          <h2 className="modal-title">{game.name}</h2>
          <p className="modal-description">{game.description}</p>
          <div className="modal-info-grid">
            <div className="info-item">
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(game.releaseDate).toLocaleDateString()}
              </p>
            </div>
            <div className="info-item">
              <p>
                <strong>Precio:</strong> ${game.price.toFixed(2)}
              </p>
            </div>
            <div className="info-item">
              <p>
                <strong>Stock:</strong> {game.stock}
              </p>
            </div>
            <div className="info-item">
              <p>
                <strong>Rating:</strong> {game.rating}
              </p>
            </div>
          </div>

          <div className="modal-tags">
            <span className="tags-label">Géneros</span>
            <div className="tags-container">
              {game.genres?.map((genre, index) => (
                <span key={index} className="tag">
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <div className="modal-tags">
            <span className="tags-label">Plataformas</span>
            <div className="tags-container">
              {game.platforms?.map((platform, index) => (
                <span key={index} className="tag secondary">
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
