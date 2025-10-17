import { useVideogames } from "@hooks/useVideogames";
import { Pagination } from "@components/pagination";
import "./VideogameList.css";

export function VideogamesList() {
  const pageSize = 6;
  const {
    videogames,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useVideogames(pageSize);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="videogames-list-container">
      <div className="videogames-grid">
        {videogames.map((game) => (
          <div key={game.id} className="videogame-card">
            <img
              src={game.imageUrl}
              alt={game.name}
              className="game-card-image"
            />

            <div className="game-card-content">
              <h2 className="game-title">{game.name}</h2>
              <p className="game-description">{game.description}</p>

              <div className="game-details">
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(game.releaseDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Precio:</strong> ${game.price.toFixed(2)}
                </p>
                <p>
                  <strong>Stock:</strong> {game.stock}
                </p>
                <p>
                  <strong>Rating:</strong> {game.rating}
                </p>
                <p>
                  <strong>Géneros:</strong> {game.genres.join(", ")}
                </p>
                <p>
                  <strong>Plataformas:</strong> {game.platforms.join(", ")}
                </p>
              </div>
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
    </div>
  );
}

export default VideogamesList;
