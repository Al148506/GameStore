import { useState, useEffect } from "react";
import {
  getVideogames,
  deleteVideogame as deleteVideogameApi,
  updateVideogame as updateVideogameApi,
} from "../features/videogames/services";
import type { VideogameDto } from "../types/videogame";
import Swal from "sweetalert2";
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
    const result = await Swal.fire({
      title: "¿Eliminar videojuego?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteVideogameApi(id);
      // 🧠 Actualiza la lista local sin volver a pedir los datos
      setVideogames((prev) => prev.filter((game) => game.id !== id));
      Swal.fire("Eliminado", "El videojuego ha sido eliminado", "success");
    } catch (err) {
      console.error("Error deleting videogame:", err);
      Swal.fire("Error", "No se pudo eliminar el videojuego", "error");
    }
  };

  const updateVideogame = async (
    id: number,
    updatedData: Partial<VideogameDto>
  ) => {
    try {
      const updatedGame = await updateVideogameApi(id, updatedData);

      // 🔄 Actualiza el estado local sin volver a hacer fetch completo
      setVideogames((prev) =>
        prev.map((game) => (game.id === id ? updatedGame : game))
      );

      Swal.fire(
        "Actualizado",
        "El videojuego ha sido actualizado correctamente",
        "success"
      );
    } catch (err) {
      console.error("Error updating videogame:", err);
      Swal.fire("Error", "No se pudo actualizar el videojuego", "error");
    }
  };

  return {
    videogames,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    deleteVideogame,
    updateVideogame, 
  };
}
