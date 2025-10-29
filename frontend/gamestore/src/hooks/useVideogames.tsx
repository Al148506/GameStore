import { useState, useEffect } from "react";
import {
  getVideogames,
  deleteVideogame as deleteVideogameApi,
} from "../features/videogames/services";
import type { VideogameDto } from "../types/videogame";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function useVideogames(pageSize = 2) {
  const [videogames, setVideogames] = useState<VideogameDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getVideogames(currentPage, pageSize)
      .then((data) => {
        if (!cancelled) {
          setVideogames(data.items);
          setTotal(data.total);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Error cargando videojuegos");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentPage, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  const deleteVideogame = async (id: number) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este videojuego?"
    );
    if (!confirmDelete) return;

    try {
      await deleteVideogameApi(id);
      // 🧠 Actualiza la lista local sin volver a pedir los datos
      setVideogames((prev) => prev.filter((game) => game.id !== id));
    } catch (err) {
      console.error("Error al eliminar el videojuego:", err);
      setError("No se pudo eliminar el videojuego.");
    }
  };

  return {
    videogames,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    deleteVideogame
  };
}
