import { useState, useEffect } from "react";
import { OrderSummary } from "../components/Orders/OrderSummary";
import { OrderItems } from "../components/Orders/OrderItems";
import { orderApi } from "../api/orderApi";
import type { OrderDto } from "../types/Order/order";
import Navbar from "@components/Navbar";
import "../styles/success.css";

export default function OrderHistory() {
  const [orders, setOrders] = useState<OrderDto[] | null>(null);

  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>(
    {}
  );
  useEffect(() => {
    async function fetchLastOrder() {
      try {
        const data = await orderApi.getHistory();
        setOrders(data);
      } catch (error) {
         console.error("Error fetching order history:", error);
      }
    }
    fetchLastOrder();
  }, []);

    // Manejar expandir/colapsar
  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  if (!orders) {
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
            <h1 className="success-title">Historial de Pedidos</h1>
            <p className="success-message">Revisa tus compras anteriores 🎮</p>
          </div>
            <div className="success-content">
            {orders.map((order) => {
              const isExpanded = expandedOrders[order.id] ?? false;

              return (
                <div key={order.id} className="order-history-item">
                  <OrderSummary order={order} />

                  <button
                    onClick={() => toggleOrderDetails(order.id)}
                    className="btn-show-details"
                  >
                    {isExpanded ? "Ocultar detalles" : "Ver más detalles"}
                  </button>

                  {isExpanded && <OrderItems items={order.items}
                   title={`Artículos del pedido #${order.id}`} />}
                </div>
              );
            })}
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
