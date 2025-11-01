// VideogameCard.tsx
import type { VideogameDto } from "../types/videogame";
import Button from "@components/Button";

interface VideogameCardProps {
  game: VideogameDto;
  onCardClick: (game: VideogameDto) => void;
  onEdit: (game: VideogameDto) => void;
  onDelete: (id: number) => void;
}

export function VideogameCard({ 
  game, 
  onCardClick, 
  onEdit, 
  onDelete 
}: VideogameCardProps) {
  return (
    <div
      className="videogame-card"
      onClick={() => onCardClick(game)}
    >
      <img
        src={game.imageUrl}
        alt={game.name}
        className="game-card-image"
      />
      <div className="game-card-content">
        <h2 className="game-title">{game.name}</h2>
        <p className="game-price">${game.price.toFixed(2)}</p>
      </div>
      <div className="card-actions">
        <Button
          text="Edit"
          editButton={true}
          manejarClic={(e) => {
            e.stopPropagation(); // Evita que se abra el modal al editar
            onEdit(game);
          }}
        />
        <Button
          text="Delete"
          editButton={false}
          manejarClic={(e) => {
            e.stopPropagation(); // Evita que se abra el modal al eliminar
            onDelete(game.id);
          }}
        />
      </div>
    </div>
  );
}
