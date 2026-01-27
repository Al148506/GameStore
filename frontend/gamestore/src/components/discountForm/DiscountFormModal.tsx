import { useEffect, useState } from "react";
import type { CreateDiscountRequest } from "../../types/discount/discount";
import { useVideogameOptions } from "@hooks/useVideogameOptions";
import { DiscountFormFields } from "./DiscountFormFields";

export interface DiscountFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  discountToEdit?: CreateDiscountRequest & { id: string };
  onClose: () => void;
  onCreate?: (data: CreateDiscountRequest) => Promise<void>;
  onSave?: (id: string, data: CreateDiscountRequest) => Promise<void>;
}


export function DiscountFormModal({
  isOpen,
  mode,
  discountToEdit,
  onClose,
  onCreate,
  onSave,
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
};
const [form, setForm] = useState<CreateDiscountRequest>(defaultForm);

useEffect(() => {
  if (!isOpen) return;

  if (mode === "edit" && discountToEdit) {
    setForm({
      ...discountToEdit,
      startDate: discountToEdit.startDate.slice(0, 10),
      endDate: discountToEdit.endDate.slice(0, 10),
    });
  } else {
    setForm(defaultForm);
  }
}, [isOpen, mode, discountToEdit]);


  if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "create" && onCreate) {
      await onCreate({
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      });
    }
    if (mode === "edit" && onSave && discountToEdit) {
      await onSave(discountToEdit.id, {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      });
    }
    onClose();
  }

return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === "create" ? "Create Discount" : "Edit Discount"}</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <DiscountFormFields
            form={form}
            setForm={setForm}
            genres={genres}
            platforms={platforms}
          />

          <button className="btn-primary" type="submit">
            {mode === "create" ? "Create" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
