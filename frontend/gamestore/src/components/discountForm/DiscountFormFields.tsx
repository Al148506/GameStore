import type { ChangeEvent } from "react";
import type { CreateDiscountRequest } from "../../types/discount/discount";
import { ScopeSelector } from "./ScopeSelector";
import { CouponFields } from "./CouponFields";

interface DiscountFormFieldsProps {
  form: CreateDiscountRequest;
  setForm: React.Dispatch<React.SetStateAction<CreateDiscountRequest>>;
  genres: { id: number; name: string }[];
  platforms: { id: number; name: string }[];
  errors?: Record<string, string[]>;
  globalError?: string | null;
}

export function DiscountFormFields({
  form,
  setForm,
  genres,
  platforms,
  errors = {},
  globalError,
}: DiscountFormFieldsProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        (name === "startDate" || name === "endDate") && value === ""
          ? null
          : value,
    }));
  };

  const getError = (field: string) => errors[field]?.[0];

  return (
    <>
      {/* Nombre */}
      <div className="form-group">
        <label htmlFor="name">Nombre del descuento</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Ej. Oferta de verano"
          className={getError("name") ? "input-error" : ""}
          required
        />
        {getError("name") && (
          <span className="form-error">{getError("name")}</span>
        )}
      </div>

      {/* Tipo y tipo de valor */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="type">Tipo de descuento</label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                type: e.target.value as CreateDiscountRequest["type"],
              }))
            }
            className={getError("type") ? "input-error" : ""}
          >
            <option value="Seasonal">Temporada</option>
            <option value="Coupon">Cupón</option>
          </select>
          {getError("type") && (
            <span className="form-error">{getError("type")}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="valueType">Tipo de valor</label>
          <select
            id="valueType"
            name="valueType"
            value={form.valueType}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                valueType: e.target.value as CreateDiscountRequest["valueType"],
              }))
            }
            className={getError("valueType") ? "input-error" : ""}
          >
            <option value="Percentage">Porcentaje</option>
            <option value="Fixed">Monto fijo</option>
          </select>
          {getError("valueType") && (
            <span className="form-error">{getError("valueType")}</span>
          )}
        </div>
      </div>

      {/* Valor */}
      <div className="form-group">
        <label>
          Valor del descuento {form.valueType === "Percentage" ? "(%)" : "($)"}
        </label>
        <input
          type="number"
          min={0}
          name="value"
          value={form.value}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              value: Number(e.target.value),
            }))
          }
          className={getError("value") ? "input-error" : ""}
          required
        />
        {getError("value") && (
          <span className="form-error">{getError("value")}</span>
        )}
      </div>

      {/* Scopes */}
      <ScopeSelector
        scopes={form.discountScopes}
        genres={genres}
        platforms={platforms}
        onChange={(discountScopes) => setForm({ ...form, discountScopes })}
        error={globalError}
      />

      {/* Cupón */}
      <CouponFields
        enabled={form.type === "Coupon"}
        code={form.coupon?.code}
        maxUses={form.coupon?.maxUses}
        onChange={(coupon) => setForm((prev) => ({ ...prev, coupon }))}
      />

      {/* Fechas */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">Fecha de inicio</label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={form.startDate ?? ""}
            onChange={handleChange}
            className={getError("startDate") ? "input-error" : ""}
          />
          {getError("startDate") && (
            <span className="form-error">{getError("startDate")}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="endDate">Fecha de fin</label>
          <input
            id="endDate"
            type="date"
            name="endDate"
            value={form.endDate ?? ""}
            onChange={handleChange}
            className={getError("endDate") ? "input-error" : ""}
          />
          {getError("endDate") && (
            <span className="form-error">{getError("endDate")}</span>
          )}
        </div>
      </div>
    </>
  );
}
