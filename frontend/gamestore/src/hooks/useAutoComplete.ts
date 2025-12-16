import type { Genre, Platform } from "../types/Videogame/videogame";
import { useState } from "react";

interface VideogameAutoComplete{
    genres:Genre[],
    platforms: Platform[],
}

export function useVideogameAutoComplete({ genres, platforms }: VideogameAutoComplete) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function normalizeRating(raw: string): string {
    if (!raw || raw.trim() === "") return "RP";
    const v = raw.trim().toLowerCase();
    if (v.includes("mature") || v === "m") return "M";
    if (v.includes("teen") || v === "t") return "T";
    if (v.includes("10") || v.includes("e10")) return "E10";
    if (v.includes("everyone") || v === "e") return "E";
    if (v.includes("adult") || v === "ao") return "AO";
    return "RP";
  }

  const mapGenres = (apiGenres: string[]) =>
    genres
      .filter((g) => apiGenres.includes(g.name))
      .map((g) => g.id);

  const mapPlatforms = (apiPlats: string[]) =>
    platforms
      .filter((p) => apiPlats.includes(p.name))
      .map((p) => p.id);

  async function autoComplete(name: string) {
    if (!name.trim()) {
      setError("Primero escribe un nombre.");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5200/api/autoComplete?name=${encodeURIComponent(name)}`
      );

      if (!response.ok) {
        setError("No se encontró información.");
        return null;
      }

      const data = await response.json();

      return {
        name: data.name,
        description: data.description,
        rating: normalizeRating(data.rating),
        releaseDate: data.releaseDate,
        imageUrl: data.imageUrl,
        genreIds: mapGenres(data.genres),
        platformIds: mapPlatforms(data.platforms),
      };
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al autocompletar.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    autoComplete,
    isLoading,
    error,
  };
}
