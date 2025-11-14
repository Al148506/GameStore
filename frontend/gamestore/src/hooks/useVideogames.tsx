import { useState, useEffect } from "react";
import {
  getVideogames,
  deleteVideogame as deleteVideogameApi,
  updateVideogame as updateVideogameApi,
  createVideogame as createVideogameApi,
} from "../api/videogameApi";
import type { VideogameDto } from "../types/Videogame/videogame";
import Swal from "sweetalert2";
import axios from "axios";

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

  const createVideogame = async (newGameData: Omit<VideogameDto, "id">) => {
    try {
      console.log("📤 Creando videojuego:", newGameData);
      const createdGame = await createVideogameApi(newGameData);

      // ✅ Agregar el nuevo juego al estado local
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
      console.log("🔄 Intentando actualizar videojuego ID:", id); // ✅ Debug
      console.log("📋 Datos a actualizar:", updatedData); // ✅ Debug
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
      {
        // ✅ Manejo detallado del error
        console.error("❌ Error completo:", err);

        if (axios.isAxiosError(err)) {
          if (err.response) {
            console.error("📋 Detalles del error 400:");
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);

            // Extrae el mensaje de error del backend si existe
            const errorMessage =
              err.response.data?.message ||
              err.response.data?.error ||
              err.response.data?.title ||
              JSON.stringify(err.response.data); // ✅ Muestra todo si no hay mensaje específico

            Swal.fire(
              "Error",
              `No se pudo actualizar: ${errorMessage}`,
              "error"
            );
          } else {
            Swal.fire("Error", "No se recibió respuesta del servidor", "error");
          }
        } else {
          Swal.fire("Error", "Error desconocido al actualizar", "error");
        }
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
