import { useState, useEffect } from "react";
import { OrderSummary } from "../components/orders/OrderSummary.tsx";
import { OrderItems } from "../components/orders/OrderItems.tsx";
import { orderApi } from "../api/orderApi.ts";
import type { OrderDto } from "../types/order/order.ts";
import Navbar from "@components/common/Navbar.tsx";
import "../styles/success.css";

export default function SuccessPage() {
  const [order, setOrder] = useState<OrderDto | null>(null);

  useEffect(() => {
    async function fetchLastOrder() {
      try {
        const data = await orderApi.getLastOder();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching last order:", error);
      }
    }
    fetchLastOrder();
  }, []);

  if (!order) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando información del pedido...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="success-page">
        <div className="success-container">
          <div className="success-header">
            <h1 className="success-title">¡Pago completado!</h1>
            <p className="success-message">Gracias por tu compra 🎮</p>
          </div>

          <div className="success-content">
            <OrderSummary order={order} />
            <OrderItems items={order.items} />
          </div>

          <div className="success-footer">
            <button
              onClick={() => (window.location.href = "/home")}
              className="btn-back-store"
            >
              Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
