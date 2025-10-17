import api from "../../api/axios";
import type { Videogame } from "../../types/videogame";

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
): Promise<PaginatedResponse<Videogame>> => {
  const res = await api.get<PaginatedResponse<Videogame>>("/api/games", {
    params: { page, pageSize },
  });
  return res.data;
};

export const getVideogame = async (id: number): Promise<Videogame> => {
  const res = await api.get<Videogame>(`/api/games/${id}`);
  return res.data;
};

export const createVideogame = async (
  payload: Partial<Videogame>
): Promise<Videogame> => {
  const res = await api.post<Videogame>("/api/games", payload);
  return res.data;
};

export const updateVideogame = async (
  id: number,
  payload: Partial<Videogame>
): Promise<Videogame> => {
  const res = await api.put<Videogame>(`/api/games/${id}`, payload);
  return res.data;
};

export const deleteVideogame = async (id: number): Promise<void> => {
  await api.delete(`/api/games/${id}`);
};
