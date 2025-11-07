import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Select from "react-select";
import type { MultiValue, ActionMeta } from "react-select";
import type { VideogameDto, Genre, Platform } from "../types/videogame";
import { getGenres, getPlatforms } from "../features/videogames/services";
import "../styles/modal.css";

interface VideogameModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  gameToEdit?: VideogameDto;
  onClose: () => void;
  onCreate?: (newGame: Omit<VideogameDto, "id">) => Promise<void>;
  onSave?: (id: number, data: Partial<VideogameDto>) => void;
}

interface FormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  rating: string;
  releaseDate: string;
  imageUrl: string;
  genreIds: number[];
  platformIds: number[];
}

type SelectOption = { value: number; label: string };

const ratings = [
  { value: "E", text: "E Everyone" },
  { value: "E10", text: "E10 Everyone 10+" },
  { value: "T", text: "T Teen" },
  { value: "M", text: "M Mature" },
  { value: "AO", text: "AO Adults Only" },
  { value: "RP", text: "RP Rating Pending" },
];

const customSelectStyles = {
  control: (provided: import("react-select").CSSObjectWithLabel) => ({
    ...provided,
    borderRadius: "8px",
    borderColor: "#ccc",
    minHeight: "42px",
    boxShadow: "none",
  }),
  option: (provided: import("react-select").CSSObjectWithLabel) => ({
    ...provided,
    color: "#333",
  }),
};

export function VideogameFormModal({
  isOpen,
  mode,
  gameToEdit,
  onClose,
  onCreate,
  onSave,
}: VideogameModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    rating: "",
    releaseDate: "",
    imageUrl: "",
    genreIds: [],
    platformIds: [],
  });

  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [availablePlatforms, setAvailablePlatforms] = useState<Platform[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function loadOptions() {
      setLoadingOptions(true);
      try {
        const [genres, platforms] = await Promise.all([
          getGenres(),
          getPlatforms(),
        ]);
        setAvailableGenres(genres);
        setAvailablePlatforms(platforms);
      } catch (error) {
        console.error("Error loading options", error);
      } finally {
        setLoadingOptions(false);
      }
    }

    if (isOpen) loadOptions();
  }, [isOpen]);

  useEffect(() => {
    if (mode === "edit" && gameToEdit && !loadingOptions) {
      // Mapear los nombres a IDs
      const matchedGenreIds =
        availableGenres
          .filter((g) => gameToEdit.genres?.includes(g.name))
          .map((g) => g.id) || [];

      const matchedPlatformIds =
        availablePlatforms
          .filter((p) => gameToEdit.platforms?.includes(p.name))
          .map((p) => p.id) || [];
      setFormData({
        name: gameToEdit.name,
        description: gameToEdit.description,
        price: gameToEdit.price,
        stock: gameToEdit.stock,
        rating: gameToEdit.rating,
        releaseDate: gameToEdit.releaseDate.split("T")[0],
        imageUrl: gameToEdit.imageUrl,
        genreIds: matchedGenreIds,
        platformIds: matchedPlatformIds,
      });
      setImageError(false);
    } else if (mode === "create" && !loadingOptions) {
      setFormData({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        rating: "",
        releaseDate: "",
        imageUrl: "",
        genreIds: [],
        platformIds: [],
      });
      setImageError(false);
    }
  }, [
    mode,
    gameToEdit,
    isOpen,
    loadingOptions,
    availableGenres,
    availablePlatforms,
  ]);

  if (!isOpen) return null;

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));

    if (name === "imageUrl") setImageError(false);
  }

  function handleMultiSelectChange(
    newValue: MultiValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) {
    const name = actionMeta.name;
    if (!name) return;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue ? newValue.map((option) => option.value) : [],
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (imageError) return;
    if (mode === "create" && onCreate) {
      await onCreate(formData);
    } else if (mode === "edit" && onSave && gameToEdit) {
      onSave(gameToEdit.id, formData);
    }
    handleClose();
  }

  function handleClose() {
    onClose();
  }

  const genreOptions = availableGenres.map((g) => ({
    value: g.id,
    label: g.name,
  }));
  const platformOptions = availablePlatforms.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const title =
    mode === "create" ? "Agregar Nuevo Videojuego" : "Editar Videojuego";

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={handleClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
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
              <label>Precio</label>
              <input
                type="number"
                name="price"
                min={0}
                step={0.01}
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                min={0}
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Clasificación ESRB</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
              >
                <option value="">Selecciona una clasificación</option>
                {ratings.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Fecha de Lanzamiento</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Géneros</label>
            <Select
              isMulti
              name="genreIds"
              options={genreOptions}
              value={genreOptions.filter((option) =>
                formData.genreIds.includes(option.value)
              )}
              onChange={handleMultiSelectChange}
              placeholder="Selecciona géneros..."
              isLoading={loadingOptions}
              styles={customSelectStyles}
            />
          </div>
          <div className="form-group">
            <label>Plataformas</label>
            <Select
              isMulti
              name="platformIds"
              options={platformOptions}
              value={platformOptions.filter((option) =>
                formData.platformIds.includes(option.value)
              )}
              onChange={handleMultiSelectChange}
              placeholder="Selecciona plataformas..."
              isLoading={loadingOptions}
              styles={customSelectStyles}
            />
          </div>
          <div className="form-group">
            <label>URL de Imagen</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              required
            />
            {formData.imageUrl && !imageError && (
              <div className="image-preview-container">
                <p className="preview-label">Vista previa</p>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="image-preview"
                  onError={() => setImageError(true)}
                />
              </div>
            )}
            {imageError && (
              <p className="error-text">URL de imagen no válida</p>
            )}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn-save ${mode === "edit" ? "edit-btn" : ""}`}
              disabled={imageError}
            >
              {mode === "create" ? "Crear Videojuego" : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
