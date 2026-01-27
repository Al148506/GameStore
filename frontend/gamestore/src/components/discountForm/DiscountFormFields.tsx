import type { ChangeEvent } from "react";
import type { CreateDiscountRequest } from "../../types/discount/discount";
import { ScopeSelector } from "./ScopeSelector";
import { CouponFields } from "./CouponFields";

interface DiscountFormFieldsProps {
  form: CreateDiscountRequest;
  setForm: React.Dispatch<React.SetStateAction<CreateDiscountRequest>>;
  genres: { id: number; name: string }[];
  platforms: { id: number; name: string }[];
}

export function DiscountFormFields({
  form,
  setForm,
  genres,
  platforms,
}: DiscountFormFieldsProps) {
  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <>
      {/* Name */}
      <div className="form-group">
        <label htmlFor="name">Discount Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g., Summer Sale"
          required
        />
      </div>

      {/* Type & ValueType */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="type">Discount Type</label>
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
          >
            <option value="Seasonal">Seasonal</option>
            <option value="Coupon">Coupon</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="valueType">Value Type</label>
          <select
            id="valueType"
            name="valueType"
            value={form.valueType}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                valueType:
                  e.target.value as CreateDiscountRequest["valueType"],
              }))
            }
          >
            <option value="Percentage">Percentage</option>
            <option value="Fixed">Fixed</option>
          </select>
        </div>
      </div>

      {/* Value */}
      <div className="form-group">
        <label>
          Discount Value {form.valueType === "Percentage" ? "(%)" : "($)"}
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
          required
        />
      </div>

      {/* Scopes */}
      <ScopeSelector
        scopes={form.scopes}
        genres={genres}
        platforms={platforms}
        onChange={(scopes) =>
          setForm((prev) => ({ ...prev, scopes }))
        }
      />

      {/* Coupon */}
      <CouponFields
        enabled={form.type === "Coupon"}
        onChange={(coupon) =>
          setForm((prev) => ({ ...prev, coupon }))
        }
      />

      {/* Dates */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </>
  );
}
