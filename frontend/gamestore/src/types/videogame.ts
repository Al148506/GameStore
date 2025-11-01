export interface VideogameDto {
  id: number;
  name: string;
  description: string;
  releaseDate: string; // Date como string ISO 8601
  price: number;
  stock: number;
  imageUrl: string;
  rating: string;
  genres: string[];
  platforms: string[];
}

export interface Genre {
  id: number;
  name: string;
}
export interface Platform {
  id: number;
  name: string;
}
