import type { OrderItemDto } from "../../types/Order/orderItem";
import "../../styles/orderItems.css";

export function OrderItems({ items }: { items: OrderItemDto[] }) {
  return (
    <div className="order-items">
      <h3 className="order-items-title">Artículos</h3>

      <div className="order-items-list">
        {items.map((item) => (
          <div key={item.videogameId} className="order-item-card">
            {/* {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.videogameName}
                className="order-item-image"
              />
            )} */}

            <div className="order-item-details">
              <div className="order-item-info">
                <h4 className="order-item-name">{item.videogameName}</h4>
                <p className="order-item-quantity">
                  Cantidad:{" "}
                  <span className="order-item-quantity-badge">
                    {item.quantity}
                  </span>
                </p>
              </div>

              <div className="order-item-price-section">
                <p className="order-item-unit-price">
                  ${item.unitPrice.toFixed(2)} c/u
                </p>
                <p className="order-item-total-price">
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
