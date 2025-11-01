// VideogamesGrid.tsx
import type { VideogameDto } from "../types/videogame";
import { VideogameCard } from "./VideogameCard";

interface VideogamesGridProps {
  games: VideogameDto[];
  onCardClick: (game: VideogameDto) => void;
  onEdit: (game: VideogameDto) => void;
  onDelete: (id: number) => void;
}

export function VideogamesGrid({ 
  games, 
  onCardClick, 
  onEdit, 
  onDelete 
}: VideogamesGridProps) {
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
