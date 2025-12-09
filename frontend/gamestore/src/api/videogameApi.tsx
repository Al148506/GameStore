import api from "./axios";
import type { Filters } from "../components/Searchbar";
import type {
  VideogameDto,
  Genre,
  Platform,
} from "../types/Videogame/videogame";
import type { PaginatedResponse } from "../types/Pagination/paginatedResponse";

interface Params {
  page: number;
  pageSize: number;
  search: string;
  sort: string;
  genreIds?: number[];
  platformIds?: number[];
}
export const getVideogames = async (
  page = 1,
  pageSize = 20,
  filters: Filters
): Promise<PaginatedResponse<VideogameDto>> => {
  
  // Definir sort
  let sort = "";
  if (filters.alphabet) sort = filters.alphabet;
  if (filters.price) sort = filters.price;

  // Construir parámetros
  const params: Params = {
    page,
    pageSize,
    search: filters.searchTerm || "",
    sort: sort,
  };

  if (filters.genreIds?.length) {
    params.genreIds = filters.genreIds;
  }

  if (filters.platformIds?.length) {
    params.platformIds = filters.platformIds;
  }

  // Llamada al backend con paramsSerializer
  const res = await api.get<PaginatedResponse<VideogameDto>>("games", {
    params,
    paramsSerializer: {
      indexes: null  // ⬅️ convierte arrays en genreIds=1&genreIds=16
    }
  });

  return res.data;
};

export const getVideogame = async (id: number): Promise<VideogameDto> => {
  const res = await api.get<VideogameDto>(`games/${id}`);
  return res.data;
};

// En services.tsx
export const getGenres = async (): Promise<Genre[]> => {
  const res = await api.get<Genre[]>("games/genres"); // ✅ Ruta actualizada
  return res.data;
};

export const getPlatforms = async (): Promise<Platform[]> => {
  const res = await api.get<Platform[]>("games/platforms"); // ✅ Ruta actualizada
  return res.data;
};

export const createVideogame = async (
  payload: Partial<VideogameDto>
): Promise<VideogameDto> => {
  const res = await api.post<VideogameDto>("games", payload);
  return res.data;
};

export const updateVideogame = async (
  id: number,
  payload: Partial<VideogameDto>
): Promise<VideogameDto> => {
  const res = await api.put<VideogameDto>(`games/${id}`, payload);
  return res.data;
};

export const deleteVideogame = async (id: number): Promise<void> => {
  await api.delete(`games/${id}`);
};
