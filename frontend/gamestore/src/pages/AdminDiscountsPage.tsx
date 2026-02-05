import { useMemo, useState } from "react";
import Button from "@components/common/Button";
import { DiscountList } from "../components/discountList/DiscountList";
import { DiscountFormModal } from "../components/discountForm/DiscountFormModal";
import { createDiscount } from "../api/discountsApi";
import Swal from "sweetalert2";
import "../styles/adminDiscountPage.css";
import type { CreateDiscountRequest } from "types/discount/discount";
import NavbarGeneral from "@components/common/Navbar";
import { useDiscountList } from "../hooks/useDiscountList";
import { Pagination } from "@components/common/Pagination";
import type { AxiosError } from "axios";

export const AdminDiscountsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data, loading, page, totalPages, setPage, toggle } =
    useDiscountList();

  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});

  const stats = useMemo(
    () => ({
      total: data.length,
      active: data.filter((d) => d.isActive).length,
    }),
    [data],
  );

  const handleCreateDiscount = async (data: CreateDiscountRequest) => {
    try {
      setFormErrors({}); // limpiar errores previos
      await createDiscount(data);

      await Swal.fire({
        title: "¡Descuento Creado!",
        text: `El descuento "${data.name}" fue creado exitosamente.`,
        icon: "success",
      });

      setShowCreateModal(false);
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      const axiosError = err as AxiosError<{ [key: string]: string[] }>;
      if (axiosError.response?.status === 400 && axiosError.response?.data) {
        setFormErrors(axiosError.response.data);
        return;
      }

      Swal.fire({
        title: "Error",
        text: "Ocurrió un error inesperado.",
        icon: "error",
      });
    }
  };

  return (
    <>
      <NavbarGeneral />
      <div className="admin-discounts-page">
        {/* Header */}
        <header className="admin-discounts-page__header">
          <div className="admin-discounts-page__title-wrapper">
            <svg
              className="admin-discounts-page__icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="admin-discounts-page__title">
              Gestión de Descuentos
            </h1>
          </div>
          <p className="admin-discounts-page__subtitle">
            Administra descuentos, cupones y promociones para tus productos
          </p>
        </header>

        {/* Actions Bar */}
        <div className="admin-discounts-page__actions">
          <div className="admin-discounts-page__stats">
            <div className="admin-discounts-page__stat">
              <span className="admin-discounts-page__stat-label">Total</span>
              <span className="admin-discounts-page__stat-value admin-discounts-page__stat-value--primary">
                {loading ? "—" : stats.total}
              </span>
            </div>
            <div className="admin-discounts-page__stat">
              <span className="admin-discounts-page__stat-label">Activos</span>
              <span className="admin-discounts-page__stat-value admin-discounts-page__stat-value--success">
                {loading ? "—" : stats.active}
              </span>
            </div>
          </div>

          <div className="admin-discounts-page__buttons">
            <Button
              text="Nuevo Descuento"
              variant="create"
              onClick={() => setShowCreateModal(true)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="admin-discounts-page__content">
          <DiscountList
            key={refreshKey}
            data={data}
            loading={loading}
            onToggle={toggle}
            onEdit={console.log("Pendiente")}
          />
        </div>

        {/* Modal */}
        <DiscountFormModal
          isOpen={showCreateModal}
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateDiscount}
          errors={formErrors}
        />

        <div className="pagination">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </>
  );
};
