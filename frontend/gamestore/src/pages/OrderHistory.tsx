import { useState, useEffect } from "react";
import { OrderSummary } from "../components/orders/OrderSummary.tsx";
import { OrderItems } from "../components/orders/OrderItems.tsx";
import { orderApi } from "../api/orderApi.ts";
import type { OrderDto } from "../types/order/order.ts";
import Navbar from "@components/common/Navbar.tsx";
import "../styles/success.css";
import { Pagination } from "@components/common/Pagination.tsx";
import Button from "@components/common/Button.tsx";

export default function OrderHistory() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>(
    {},
  );

  // Pagination from backend
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  // Meta info from backend
  const [totalPages, setTotalPages] = useState<number>(1);

  // Sorting
  const [sort, setSort] = useState<string>("date_desc");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await orderApi.getHistory({
          page: currentPage,
          pageSize,
          sort,
        });

        setOrders(res.items);
        setTotalPages(
          res.total % pageSize === 0
            ? res.total / pageSize
            : Math.floor(res.total / pageSize) + 1,
        );
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    }

    fetchOrders();
  }, [currentPage, sort]);

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <>
      <Navbar />

      <div className="success-page">
        <div className="success-container">
          <div className="success-header">
            <h1 className="success-title">Historial de Pedidos</h1>
            <p className="success-message">Revisa tus compras anteriores 🎮</p>
            {orders.length !== 0 && (
              <div className="sort-container">
                <label>Ordenar por:</label>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setCurrentPage(1); // Reset page when sorting
                  }}
                  className="sort-select"
                >
                  <option value="date_desc">Más recientes</option>
                  <option value="date_asc">Más antiguos</option>
                  <option value="total_desc">Total descendente</option>
                  <option value="total_asc">Total ascendente</option>
                </select>
              </div>
            )}
          </div>

          <div className="success-content">
            {orders.length === 0 ? (
              <div className="empty-orders">
                <h2>No tienes pedidos aún 📦</h2>
                <p>Cuando realices una compra, aquí aparecerá tu historial.</p>

                <Button
                  text="Ir a la tienda"
                  onClick={() => (window.location.href = "/home")}
                  variant="default"
                />
              </div>
            ) : (
              orders.map((order) => {
                const isExpanded = expandedOrders[order.id] ?? false;

                return (
                  <div key={order.id} className="order-history-item">
                    <OrderSummary order={order} />

                    <Button
                      text={
                        isExpanded ? "Ocultar detalles" : "Ver más detalles"
                      }
                      onClick={() => toggleOrderDetails(order.id)}
                      variant="edit"
                    />

                    {isExpanded && (
                      <OrderItems
                        items={order.items}
                        title={`Artículos del pedido #${order.id}`}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          <div className="success-footer"></div>
        </div>
      </div>
    </>
  );
}
