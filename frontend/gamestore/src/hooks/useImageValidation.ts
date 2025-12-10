import { useState } from "react";

export function useImageValidation() {
  const [imageError, setImageError] = useState(false);

  function validateImage(url: string) {
    if (!url) return;
    setImageError(false);

    const img = new Image();
    img.onerror = () => setImageError(true);
    img.src = url;
  }

  return { imageError, validateImage };
}
