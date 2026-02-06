import { useEffect, useState } from "react";
import type { CreateDiscountRequest } from "../../types/discount/discount";
import { useVideogameOptions } from "@hooks/useVideogameOptions";
import { DiscountFormFields } from "./DiscountFormFields";
import Button from "@components/common/Button";
import "../../styles/discountFormModal.css";
export interface DiscountFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  discountToEdit?: CreateDiscountRequest & { id: string };
  onClose: () => void;
  onCreate?: (data: CreateDiscountRequest) => Promise<void>;
  onSave?: (id: string, data: CreateDiscountRequest) => Promise<void>;
  errors?: Record<string, string[]>;
  loading: boolean;
}

export function DiscountFormModal({
  isOpen,
  mode,
  discountToEdit,
  onClose,
  onCreate,
  onSave,
  errors = {},
  loading,
}: DiscountFormModalProps) {
  const { genres, platforms } = useVideogameOptions(isOpen);

  const defaultForm: CreateDiscountRequest = {
    name: "",
    type: "Seasonal",
    valueType: "Percentage",
    value: 0,
    startDate: "",
    endDate: "",
    isActive: true,
    scopes: [],
    coupon: undefined,
  };

  const [form, setForm] = useState<CreateDiscountRequest>(defaultForm);

  // Helper para obtener el primer error de un campo
  const getError = (field: string) => {
    return errors?.[field]?.[0];
  };

useEffect(() => {
  if (!isOpen) return;

  if (mode === "edit" && discountToEdit) {
    setForm({
      ...discountToEdit,
      startDate: discountToEdit.startDate
        ? discountToEdit.startDate.slice(0, 10)
        : "",
      endDate: discountToEdit.endDate
        ? discountToEdit.endDate.slice(0, 10)
        : "",
    });
  } else {
    setForm(defaultForm);
  }
}, [isOpen, mode, discountToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

     if (!form.startDate || !form.endDate) {
    console.warn("⚠️ Fechas no seleccionadas");
    errors = ({
      startDate: ["La fecha de inicio es obligatoria"],
      endDate: ["La fecha de fin es obligatoria"],
    });

    return;
  }

    const payload: CreateDiscountRequest = {
      ...form,
      
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    };

    console.log("📦 Payload enviado:", payload);

    if (mode === "create" && onCreate) {
      await onCreate(payload);
      return;
    }

    if (mode === "edit" && onSave && discountToEdit) {
      await onSave(discountToEdit.id, payload);
      return;
    }
  };

  console.group("🧪 DiscountFormModal Debug");
  console.log("isOpen:", isOpen);
  console.log("mode:", mode);
  console.log("errors (props):", errors);
  console.log("form state:", form);
  console.groupEnd();

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* HEADER */}
        <div className="modal-header">
          <h2>{mode === "create" ? "Crear descuento" : "Editar descuento"}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* BODY */}
        <form className="modal-body" onSubmit={handleSubmit} noValidate>
          <DiscountFormFields
            form={form}
            setForm={setForm}
            genres={genres}
            platforms={platforms}
            errors={errors} // 👈 errores backend pasan aquí
          />

          {/* Error general (por si llega algo no asociado a campo) */}
          {getError("") && (
            <div className="form-error form-error--global">{getError("")}</div>
          )}

          {/* FOOTER */}
          <div className="modal-footer">
            <Button text="Cancelar" onClick={onClose} variant="delete" />

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading
                ? "Creando..."
                : mode === "create"
                  ? "Crear"
                  : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
