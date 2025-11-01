import React, { useState } from "react";
import type { VideogameDto } from "../types/videogame";
import "../styles/modal.css";

interface EditVideogameModalProps {
  game: VideogameDto;
  onClose: () => void;
  onSave: (id: number, data: Partial<VideogameDto>) => void;
}

const ratings = [
  { value: "E", text: "E (Everyone)" },
  { value: "E10+", text: "E10+ (Everyone 10+)" },
  { value: "T", text: "T (Teen)" },
  { value: "M", text: "M (Mature)" },
  { value: "AO", text: "AO (Adults Only)" },
  { value: "RP", text: "RP (Rating Pending)" },
];

export const EditVideogameModal: React.FC<EditVideogameModalProps> = ({
  game,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: game.name,
    description: game.description,
    price: game.price,
    stock: game.stock,
    imageUrl: game.imageUrl,
    rating: game.rating,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(game.id, formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Editar videojuego</h2>
          <button className="modal-close" onClick={onClose}>
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
            />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={10}
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
              />
            </div>
            <div className="form-group">
              <label>Stock:</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>ESBR:</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                {ratings.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <label>Image URL:</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl || ""} // ✅ Corregido: era formData.name
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />

          {/* ✅ Vista previa de la imagen */}
          {formData.imageUrl && (
            <div className="image-preview-container">
              <p className="preview-label">Vista previa:</p>
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="image-preview"
                onError={(e) => {
                  // ✅ Maneja el caso de URL inválida
                  e.currentTarget.src =
                    "https://via.placeholder.com/300x200?text=URL+inv%C3%A1lida";
                }}
              />
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="custom-btn edit-btn">
              Guardar cambios
            </button>
            <button
              type="button"
              className="custom-btn delete-btn"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
