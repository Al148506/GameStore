import { useEffect, useState } from "react";
import type {
  CreateDiscountRequest,
  DiscountDetailDto,
  DiscountType,
  DiscountValueType,
  UpdateDiscountRequest,
} from "../../types/discount/discount";
import { useVideogameOptions } from "@hooks/useVideogameOptions";
import { DiscountFormFields } from "./DiscountFormFields";
import Button from "@components/common/Button";
import "../../styles/discountFormModal.css";

export interface DiscountFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  discountToEdit?: DiscountDetailDto;
  onClose: () => void;
  onCreate?: (data: CreateDiscountRequest) => Promise<void>;
  onSave?: (id: string, data: UpdateDiscountRequest) => Promise<void>;
  errors?: Record<string, string[]>;
  globalError?: string | null;
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
  globalError,
}: DiscountFormModalProps) {
  const { genres, platforms } = useVideogameOptions(isOpen);

  const defaultForm: CreateDiscountRequest = {
    name: "",
    type: "Seasonal",
    valueType: "Percentage",
    value: 0,
    startDate: null,
    endDate: null,
    isActive: true,
    scopes: [],
    coupon: undefined,
  };

  const [form, setForm] = useState<CreateDiscountRequest>(defaultForm);

  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && discountToEdit) {
      setForm({
        name: discountToEdit.name,
        type: discountToEdit.type as DiscountType,
        valueType: discountToEdit.valueType as DiscountValueType,
        value: discountToEdit.value,
        startDate: discountToEdit.startDate
          ? discountToEdit.startDate.slice(0, 10)
          : null,
        endDate: discountToEdit.endDate
          ? discountToEdit.endDate.slice(0, 10)
          : null,
        isActive: discountToEdit.isActive,
        scopes: discountToEdit.discountScopes.map((s) => ({
          targetType: s.targetType,
          targetId: s.targetId ?? undefined,
        })),
        coupon: discountToEdit.coupon
          ? {
              code: discountToEdit.coupon.code,
              maxUses: discountToEdit.coupon.maxUses ?? undefined,
            }
          : undefined,
      });
      return;
    }

    if (mode === "create") {
      setForm(defaultForm);
    }
  }, [isOpen, mode, discountToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateDiscountRequest = {
      ...form,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
    };

    console.log("📦 Payload enviado:", payload);

    if (mode === "create" && onCreate) {
      await onCreate(payload);
      return;
    }

    if (mode === "edit" && onSave && discountToEdit) {
      await onSave(discountToEdit.id, payload);
    }
  };

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
            errors={errors}
            globalError={globalError}
          />

          {/* FOOTER */}
          <div className="modal-footer">
            <Button text="Cancelar" onClick={onClose} variant="delete" />

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading
                ? "Guardando..."
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
