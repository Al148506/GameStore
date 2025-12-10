import type { VideogameDto, Genre, Platform } from "../types/Videogame/videogame";

export function mapGameToFormData(
  game: VideogameDto,
  genres: Genre[],
  platforms: Platform[]
) {
  const matchedGenreIds = genres
    .filter(g => game.genres?.includes(g.name))
    .map(g => g.id);

  const matchedPlatformIds = platforms
    .filter(p => game.platforms?.includes(p.name))
    .map(p => p.id);

  return {
    name: game.name,
    description: game.description,
    price: game.price,
    stock: game.stock,
    rating: game.rating,
    releaseDate: game.releaseDate.split("T")[0],
    imageUrl: game.imageUrl,
    genreIds: matchedGenreIds,
    platformIds: matchedPlatformIds,
  };
}
