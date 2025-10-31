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
    rating: game.rating,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
        <h2 className="edit-title">Editar videojuego</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Descripción:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={10}
          />

          <label>Precio:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />

          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
          />
          <label>ESBR Rating:</label>
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

          <div className="modal-actions">
            <button type="submit" className="edit-btn">
              Guardar cambios
            </button>
            <button type="button" className="delete-btn" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
