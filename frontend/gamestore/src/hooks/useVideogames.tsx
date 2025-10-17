import { useState, useEffect } from "react";
import { getVideogames } from "../features/videogames/services";
import type { Videogame } from "../types/videogame";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function useVideogames(pageSize = 2) {
  const [videogames, setVideogames] = useState<Videogame[]>([]);
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

  return {
    videogames,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
  };
}
