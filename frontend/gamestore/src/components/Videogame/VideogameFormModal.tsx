import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useVideogameOptions } from "../../hooks/useVideogameOptions";
import { useImageValidation } from "../../hooks/useImageValidation";
import { mapGameToFormData } from "../../utils/mapGameToFormData";
import { ratings } from "../../constants/videogameRatings";
import type { VideogameDto } from "../../types/videogame/videogame";
import { useVideogameAutoComplete } from "../../hooks/useAutoComplete";
import { MultiSelectField } from "../common/MultiSelectField";

import "../../styles/modal.css";
interface VideogameModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  gameToEdit?: VideogameDto;
  onClose: () => void;
  onCreate?: (newGame: Omit<VideogameDto, "id">) => Promise<void>;
  onSave?: (id: number, data: Partial<VideogameDto>) => void;
}

interface Option {
  value: number;
  label: string;
}

interface FormState {
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

const defaultForm: FormState = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  rating: "",
  releaseDate: "",
  imageUrl: "",
  genreIds: [],
  platformIds: [],
};

export function VideogameFormModal({
  isOpen,
  mode,
  gameToEdit,
  onClose,
  onCreate,
  onSave,
}: VideogameModalProps) {
  const { genres, platforms, loading } = useVideogameOptions(isOpen);
  const { imageError, validateImage } = useImageValidation();

  const [formData, setFormData] = useState<FormState>(defaultForm);

  const {
    autoComplete,
    isLoading: isAutoLoading,
    error: autoError,
  } = useVideogameAutoComplete({ genres, platforms });

  // Cargar valores iniciales
  useEffect(() => {
    if (!loading) {
      if (mode === "edit" && gameToEdit) {
        setFormData(mapGameToFormData(gameToEdit, genres, platforms));
      } else {
        setFormData(defaultForm);
      }
    }
  }, [loading, mode, gameToEdit, genres, platforms]);

  if (!isOpen) return null;

  const genreOptions: Option[] = genres.map((g) => ({
    value: g.id,
    label: g.name,
  }));
  const platformOptions: Option[] = platforms.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  // Maneja inputs normales
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));

    if (name === "imageUrl") validateImage(value);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (imageError) return;

    if (mode === "create" && onCreate) {
      await onCreate(formData);
    } else if (mode === "edit" && onSave && gameToEdit) {
      onSave(gameToEdit.id, formData);
    }

    onClose();
  }

  const title =
    mode === "create" ? "Agregar Nuevo Videojuego" : "Editar Videojuego";

  async function handleAutoComplete() {
    const result = await autoComplete(formData.name);

    if (!result) return;

    setFormData((prev) => ({
      ...prev,
      ...result,
    }));

    validateImage(result.imageUrl);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <button
            type="button"
            onClick={handleAutoComplete}
            disabled={isAutoLoading || !formData.name.trim()}
            className="autocomplete-btn"
          >
            {isAutoLoading ? (
              <>
                <span className="spinner" />
                Cargando...
              </>
            ) : (
              <>✨ Autocompletar</>
            )}
          </button>

          {autoError && <p style={{ color: "red" }}>{autoError}</p>}

          {/* Descripción */}
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            {/* Precio */}
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                name="price"
                min={0}
                step={0.01}
                required
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            {/* Stock */}
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                min={0}
                required
                value={formData.stock}
                onChange={handleChange}
              />
            </div>

            {/* ESRB */}
            <div className="form-group">
              <label>Clasificación ESRB</label>
              <select
                name="rating"
                required
                value={formData.rating}
                onChange={handleChange}
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

          {/* Fecha */}
          <div className="form-group">
            <label>Fecha de lanzamiento</label>
            <input
              type="date"
              name="releaseDate"
              required
              value={formData.releaseDate}
              onChange={handleChange}
            />
          </div>

          {/* Géneros */}
          <MultiSelectField
            label="Géneros"
            name="genreIds"
            options={genreOptions}
            selectedValues={formData.genreIds}
            isLoading={loading}
            onChange={(values) =>
              setFormData((prev) => ({ ...prev, genreIds: values }))
            }
          />

          {/* Plataformas */}
          <MultiSelectField
            label="Plataformas"
            name="platformIds"
            options={platformOptions}
            selectedValues={formData.platformIds}
            isLoading={loading}
            onChange={(values) =>
              setFormData((prev) => ({ ...prev, platformIds: values }))
            }
          />

          {/* Imagen */}
          <div className="form-group">
            <label>URL de Imagen</label>
            <input
              type="text"
              name="imageUrl"
              required
              placeholder="https://ejemplo.com/img.jpg"
              value={formData.imageUrl}
              onChange={handleChange}
            />
            {formData.imageUrl && !imageError && (
              <div className="image-preview-container">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="image-preview"
                  onError={() => validateImage(formData.imageUrl)}
                />
              </div>
            )}
          </div>

          {imageError && (
            <p className="text-red">La imagen no se pudo cargar.</p>
          )}

          <button className="btn-primary" type="submit">
            {mode === "create" ? "Crear" : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
