import { useCart } from "@hooks/useCart";
import { useState } from "react";
import "../../styles/cartCoupon.css";

const CartCoupon = () => {
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const { isLoading, applyCoupon } = useCart();

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) return;

    setCouponError(null); // Limpiar error previo
    setCouponSuccess(null);

    try {
      await applyCoupon(code);
      setCouponSuccess("🎉 Cupón aplicado correctamente");
      setCouponCode(""); // Limpiar input después del éxito
    } catch (error) {
      setCouponError(
        error instanceof Error ? error.message : "Error al aplicar el cupón",
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && couponCode.trim() && !isLoading) {
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
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          maxLength={20}
          aria-label="Código de cupón"
          aria-invalid={!!couponError}
          aria-describedby={couponError ? "coupon-error" : undefined}
        />

        <button
          className="coupon-btn"
          onClick={handleApplyCoupon}
          disabled={!couponCode.trim() || isLoading}
          aria-label="Aplicar cupón"
        >
          {isLoading ? (
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
        <small className="coupon-success" id="coupon-error" role="information">
          {couponSuccess}
        </small>
      )}
    </div>
  );
};

export default CartCoupon;
