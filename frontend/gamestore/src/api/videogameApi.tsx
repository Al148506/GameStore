import api from "./axios";
import type {
  VideogameDto,
  Genre,
  Platform,
} from "../types/Videogame/videogame";
// Paginación opcional
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export const getVideogames = async (
  page = 1,
  pageSize = 2
): Promise<PaginatedResponse<VideogameDto>> => {
  const res = await api.get<PaginatedResponse<VideogameDto>>("games", {
    params: { page, pageSize },
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
