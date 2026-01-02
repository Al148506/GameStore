import { useState, useEffect } from "react";
import {
  getVideogames,
  deleteVideogame as deleteVideogameApi,
  updateVideogame as updateVideogameApi,
  createVideogame as createVideogameApi,
} from "../api/videogameApi";

import type { VideogameDto } from "../types/videogame/videogame";
import type { Filters } from "../components/Searchbar";

import Swal from "sweetalert2";
import axios from "axios";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function useVideogames(filters: Filters, pageSize = 20) {
  const [videogames, setVideogames] = useState<VideogameDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getVideogames(currentPage, pageSize, filters)
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
  }, [currentPage, pageSize, filters]); // 👈 ahora dependemos de filtros

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

      setVideogames((prev) => prev.filter((game) => game.id !== id));

      Swal.fire("Eliminado", "El videojuego ha sido eliminado", "success");
    } catch (err) {
      console.error("Error deleting videogame:", err);
      Swal.fire("Error", "No se pudo eliminar el videojuego", "error");
    }
  };

  const createVideogame = async (newGameData: Omit<VideogameDto, "id">) => {
    try {
      const createdGame = await createVideogameApi(newGameData);

      setVideogames((prev) => [createdGame, ...prev]);

      Swal.fire(
        "Creado",
        "El videojuego ha sido creado exitosamente",
        "success"
      );
    } catch (err) {
      console.error("Error creating videogame:", err);

      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          "No se pudo crear el videojuego";

        Swal.fire("Error", errorMessage, "error");
      } else {
        Swal.fire("Error", "No se pudo crear el videojuego", "error");
      }
    }
  };

  const updateVideogame = async (
    id: number,
    updatedData: Partial<VideogameDto>
  ) => {
    try {
      const updatedGame = await updateVideogameApi(id, updatedData);

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

      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Error al actualizar";

        Swal.fire("Error", errorMessage, "error");
      } else {
        Swal.fire("Error", "Error desconocido al actualizar", "error");
      }
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
    createVideogame,
  };
}
