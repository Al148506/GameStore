import { useState, useEffect } from "react";
import "../../styles/couponFields.css";

type Props = {
  enabled: boolean;
  code?: string;
  maxUses?: number;
  onChange: (data: { code: string; maxUses?: number }) => void;
};

export const CouponFields = ({
  enabled,
  code = "",
  maxUses,
  onChange,
}: Props) => {
  const [localCode, setLocalCode] = useState(code);
  const [localMaxUses, setLocalMaxUses] = useState<number | "">(maxUses ?? "");

  useEffect(() => {
    setLocalCode(code);
  }, [code]);

  useEffect(() => {
    setLocalMaxUses(maxUses ?? "");
  }, [maxUses]);

  const handleCodeChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setLocalCode(upperValue);
    onChange({
      code: upperValue,
      maxUses: typeof localMaxUses === "number" ? localMaxUses : undefined,
    });
  };

  const handleMaxUsesChange = (value: string) => {
    const numValue = value === "" ? "" : Number(value);
    setLocalMaxUses(numValue);
    onChange({
      code: localCode,
      maxUses: typeof numValue === "number" ? numValue : undefined,
    });
  };

  if (!enabled) return null;

  return (
    <div className="coupon-fields">
      <div className="coupon-fields__header">
        <svg
          className="coupon-fields__icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <h4 className="coupon-fields__title">Coupon Configuration</h4>
      </div>

      <div className="coupon-fields__content">
        <div className="coupon-field">
          <label htmlFor="coupon-code" className="coupon-field__label">
            Coupon Code
          </label>
          <div className="coupon-field__input-wrapper">
            <input
              id="coupon-code"
              type="text"
              className="coupon-field__input coupon-field__input--code"
              placeholder="e.g., SUMMER2024"
              value={localCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              maxLength={20}
            />
          </div>
          <span className="coupon-field__helper">
            <svg
              className="coupon-field__helper-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Automatically converted to uppercase
          </span>
        </div>

        <div className="coupon-fields__divider" />

        <div className="coupon-field">
          <label htmlFor="coupon-max-uses" className="coupon-field__label">
            Maximum Uses (Optional)
          </label>
          <div className="coupon-field__input-wrapper">
            <input
              id="coupon-max-uses"
              type="number"
              className="coupon-field__input"
              placeholder="Leave empty for unlimited"
              value={localMaxUses}
              onChange={(e) => handleMaxUsesChange(e.target.value)}
              min="1"
            />
          </div>
          <span className="coupon-field__helper">
            <svg
              className="coupon-field__helper-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Total number of times this coupon can be redeemed
          </span>
        </div>
      </div>
    </div>
  );
};
