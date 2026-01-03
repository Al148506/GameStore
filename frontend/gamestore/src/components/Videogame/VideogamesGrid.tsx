// VideogamesGrid.tsx
import type { VideogameDto } from "../../types/videogame/videogame";
import { VideogameCard } from "./VideogameCard";

interface VideogamesGridProps {
  games: VideogameDto[];
  loading: boolean;
  onCardClick: (game: VideogameDto) => void;
  onEdit: (game: VideogameDto) => void;
  onDelete: (id: number) => void;
}

export function VideogamesGrid({
  games,
  loading,
  onCardClick,
  onEdit,
  onDelete,
}: VideogamesGridProps) {
  if (loading) {
    return <div className="mini-loading">Cargando videojuegos...</div>;
  }
  return (
    <div className="videogames-grid">
      {games.map((game) => (
        <VideogameCard
          key={game.id}
          game={game}
          onCardClick={onCardClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
