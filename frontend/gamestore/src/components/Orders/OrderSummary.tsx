import type { OrderDto } from "../../types/Order/order";
import "../../styles/orderSummary.css";

export function OrderSummary({ order }: { order: OrderDto }) {
  return (
    <div className="order-summary">
      <h2 className="order-summary-title">Resumen del pedido</h2>

      <div className="order-summary-grid">
        <div className="order-detail-item">
          <span className="order-detail-label">Folio:</span>
          <span className="order-detail-value order-id">{order.id}</span>
        </div>

        <div className="order-detail-item">
          <span className="order-detail-label">Fecha:</span>
          <span className="order-detail-value">
            {new Date(order.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="order-detail-item">
          <span className="order-detail-label">Total pagado:</span>
          <span className="order-detail-value total">
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>

        <div className="order-detail-item">
          <span className="order-detail-label">Método de pago:</span>
          <span className="order-detail-value">Tarjeta (Stripe)</span>
        </div>
      </div>
    </div>
  );
}
