import { useState, useEffect } from "react"; // ✅ 1. Faltaba useEffect
import type { VideogameDto, Genre, Platform } from "../types/videogame";
import Select from "react-select"; // ✅ 2. Faltaba importar Select
import { getGenres, getPlatforms } from "../features/videogames/services"; // ✅ 3. Faltaban las importaciones de servicios
import "../styles/modal.css";

interface CreateVideogameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newGame: Omit<VideogameDto, "id">) => Promise<void>;
}

export function CreateVideogameModal({
  isOpen,
  onClose,
  onCreate,
}: CreateVideogameModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    rating: "",
    releaseDate: "",
    imageUrl: "",
    genres: [] as string[],
    platforms: [] as string[],
  });

  const [imageError, setImageError] = useState(false);

  // ✅ 4. Faltaban los estados para géneros y plataformas
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<Platform[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const ratings = [
    { value: "E", text: "E (Everyone)" },
    { value: "E10+", text: "E10+ (Everyone 10+)" },
    { value: "T", text: "T (Teen)" },
    { value: "M", text: "M (Mature)" },
    { value: "AO", text: "AO (Adults Only)" },
    { value: "RP", text: "RP (Rating Pending)" },
  ];

  // ✅ 5. Faltaba el useEffect para cargar opciones
  useEffect(() => {
    if (isOpen) {
      loadOptions();
    }
  }, [isOpen]);

  const loadOptions = async () => {
    try {
      setLoadingOptions(true);
      const [genres, platforms] = await Promise.all([
        getGenres(),
        getPlatforms(),
      ]);
      setAvailableGenres(genres);
      setAvailablePlatforms(platforms);
    } catch (error) {
      console.error("Error loading options:", error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));

    if (name === "imageUrl") {
      setImageError(false);
    }
  };

  // ✅ 6. Faltaba el manejador para el select de rating
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      rating: "",
      releaseDate: "",
      imageUrl: "",
      genres: [],
      platforms: [],
    });
    setImageError(false);
    onClose();
  };

  if (!isOpen) return null;

  // ✅ 7. Estas variables deben estar DESPUÉS de los estados y ANTES del return
  const genreOptions = availableGenres.map((genre) => ({
    value: genre.name,
    label: genre.name,
  }));

  const platformOptions = availablePlatforms.map((platform) => ({
    value: platform.name,
    label: platform.name,
  }));

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Agregar Nuevo Videojuego</h2>
          <button className="modal-close" onClick={handleClose}>
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Stock:</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>ESRB:</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleSelectChange} // ✅ Corregido: agregado onChange
                className="w-full border rounded p-2"
                required // ✅ Agregado required
              >
                <option value="">Selecciona una clasificación</option>{" "}
                {/* ✅ Opción por defecto */}
                {ratings.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.text}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Fecha de Lanzamiento:</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>URL de Imagen:</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              required
            />

            {formData.imageUrl && (
              <div className="image-preview-container">
                <p className="preview-label">Vista previa:</p>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="image-preview"
                  onError={() => setImageError(true)}
                  onLoad={() => setImageError(false)}
                  style={{ display: imageError ? "none" : "block" }}
                />
                {imageError && (
                  <p className="error-text">⚠️ URL de imagen no válida</p>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Géneros:</label>
            <Select
              isMulti
              options={genreOptions}
              value={formData.genres.map((g) => ({ value: g, label: g }))}
              onChange={(selectedOptions) => {
                const values = selectedOptions.map((option) => option.value);
                setFormData((prev) => ({ ...prev, genres: values }));
              }}
              placeholder="Selecciona géneros..."
              isLoading={loadingOptions}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="form-group">
            <label>Plataformas:</label>
            <Select
              isMulti
              options={platformOptions}
              value={formData.platforms.map((p) => ({ value: p, label: p }))}
              onChange={(selectedOptions) => {
                const values = selectedOptions.map((option) => option.value);
                setFormData((prev) => ({ ...prev, platforms: values }));
              }}
              placeholder="Selecciona plataformas..."
              isLoading={loadingOptions}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Crear Videojuego
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
