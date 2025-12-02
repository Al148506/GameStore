import { useState, useEffect } from "react";
import { OrderSummary } from "../components/Orders/OrderSummary";
import { OrderItems } from "../components/Orders/OrderItems";
import { orderApi } from "../api/orderApi";
import type { OrderDto } from "../types/Order/order";
import Navbar from "@components/Navbar";
import Searchbar from "@components/Searchbar";
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
      <Searchbar />
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
