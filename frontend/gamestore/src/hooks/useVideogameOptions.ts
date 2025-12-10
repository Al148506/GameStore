import { useEffect, useState } from "react";
import { getGenres, getPlatforms } from "../api/videogameApi";
import type { Genre, Platform } from "../types/Videogame/videogame";

export function useVideogameOptions(isOpen: boolean) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function load() {
      setLoading(true);
      try {
        const [g, p] = await Promise.all([getGenres(), getPlatforms()]);
        setGenres(g);
        setPlatforms(p);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isOpen]);

  return { genres, platforms, loading };
}
