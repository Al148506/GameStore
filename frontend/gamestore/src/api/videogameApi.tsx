import api from "./axios";
import type { Filters } from "../components/Searchbar";
import type {
  VideogameDto,
  Genre,
  Platform,
} from "../types/Videogame/videogame";
import type { PaginatedResponse } from "../types/Pagination/paginatedResponse";



export const getVideogames = async (
  page = 1,
  pageSize = 20,
  filters: Filters
): Promise<PaginatedResponse<VideogameDto>> => {
  
  // Convertir filtros a parámetros del backend
  let sort = "";

  if (filters.alphabet) sort = filters.alphabet;
  if (filters.price) sort = filters.price;

  const res = await api.get<PaginatedResponse<VideogameDto>>("games", {
    params: {
      page,
      pageSize,
      search: filters.searchTerm || "",
      sort: sort || ""
    },
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
