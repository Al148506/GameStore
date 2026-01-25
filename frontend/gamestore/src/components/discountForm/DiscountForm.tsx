import { useState } from "react";
import { useDiscountAdmin } from "../../hooks/useDiscountAdmin";
import { ScopeSelector } from "./ScopeSelector";
import { CouponFields } from "./CouponFields";
import type { CreateDiscountRequest } from "../../types/discount/discount";

import "../../styles/discountForm.css";
import { useVideogameOptions } from "@hooks/useVideogameOptions";

export const DiscountForm = () => {
  const { submit, loading, error, success } = useDiscountAdmin();
  const { genres, platforms } = useVideogameOptions(true);

  const [form, setForm] = useState<CreateDiscountRequest>({
    name: "",
    type: "Seasonal",
    valueType: "Percentage",
    value: 0,
    startDate: "",
    endDate: "",
    isActive: true,
    scopes: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = () => {
    submit({
      ...form,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
    });
  };

  return (
    <div className="discount-form">
      <h2 className="discount-form__title">Create Discount</h2>

      <div className="form-group">
        <label htmlFor="name">Discount Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="e.g., Summer Sale 2024"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="type">Discount Type</label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as "Seasonal" | "Coupon",
              })
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
              setForm({
                ...form,
                valueType: e.target.value as CreateDiscountRequest["valueType"],
              })
            }
          >
            <option value="Percentage">Percentage</option>
            <option value="Fixed">Fixed</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="value">
          Discount Value {form.valueType === "Percentage" ? "(%)" : "($)"}
        </label>
        <input
          id="value"
          name="value"
          type="number"
          min="0"
          placeholder={form.valueType === "Percentage" ? "0-100" : "0.00"}
          value={form.value || ""}
          onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
        />
      </div>

      <ScopeSelector
      
        scopes={form.scopes}
        onChange={(scopes) => setForm({ ...form, scopes })} genres={genres} platforms={platforms}      />

      <CouponFields
        enabled={form.type === "Coupon"}
        onChange={(coupon) => setForm({ ...form, coupon })}
      />

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            required
            value={form.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            type="date"
            name="endDate"
            required
            value={form.endDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <button className="submit-button" disabled={loading} onClick={onSubmit}>
        {loading ? "Saving..." : "Save Discount"}
      </button>

      {error && <div className="alert alert--error">{error}</div>}
      {success && (
        <div className="alert alert--success">
          Discount created successfully!
        </div>
      )}
    </div>
  );
};
