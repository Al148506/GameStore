import { useCart } from "@hooks/useCart";
import { useState } from "react";
import "../../styles/cartCoupon.css";

const CartCoupon = () => {
  const [couponCode, setCouponCode] = useState("");
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const { isCouponLoading, applyCoupon, couponError , clearCouponError} = useCart();

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) return;

    setCouponSuccess(null);

    try {
      await applyCoupon(code);
      setCouponSuccess("🎉 Cupón aplicado correctamente");
      setCouponCode("");
      setTimeout(() => setCouponSuccess(null), 3000);
    } catch {
      // error ya mostrado por couponError
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && couponCode.trim() && !isCouponLoading) {
      handleApplyCoupon();
    }
  };

  return (
    <div className="coupon-section">
      <div className="coupon-input-group">
        <input
          type="text"
          className="coupon-input"
          placeholder="Ingresa tu código de cupón"
          value={couponCode}
          onChange={(e) => {
            setCouponCode(e.target.value.toUpperCase());
            clearCouponError();
          }}
          onKeyPress={handleKeyPress}
          disabled={isCouponLoading}
          maxLength={20}
          aria-label="Código de cupón"
          aria-invalid={!!couponError}
          aria-describedby={couponError ? "coupon-error" : undefined}
        />

        <button
          className="coupon-btn"
          onClick={handleApplyCoupon}
          disabled={!couponCode.trim() || isCouponLoading}
          aria-label="Aplicar cupón"
        >
          {isCouponLoading ? (
            <>
              <span className="coupon-btn-spinner"></span>
              Aplicando...
            </>
          ) : (
            "Aplicar"
          )}
        </button>
      </div>

      {couponError && (
        <small className="coupon-error" id="coupon-error" role="alert">
          {couponError}
        </small>
      )}
      {couponSuccess && (
        <small className="coupon-success" role="status">
          {couponSuccess}
        </small>
      )}
    </div>
  );
};

export default CartCoupon;
