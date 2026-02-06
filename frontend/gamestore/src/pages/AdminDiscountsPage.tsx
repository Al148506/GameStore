import { useMemo, useState, useEffect } from "react";
import Button from "@components/common/Button";
import { DiscountList } from "../components/discountList/DiscountList";
import { DiscountFormModal } from "../components/discountForm/DiscountFormModal";
import Swal from "sweetalert2";
import "../styles/adminDiscountPage.css";
import NavbarGeneral from "@components/common/Navbar";
import { useDiscountList } from "../hooks/useDiscountList";
import { Pagination } from "@components/common/Pagination";
import { useDiscountAdmin } from "@hooks/useDiscountAdmin";

export const AdminDiscountsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

const {
  data,
  loading: listLoading,
  page,
  totalPages,
  setPage,
  toggle,
} = useDiscountList();

const {
  submit,
  loading: submitLoading,
  fieldErrors,
  success,
} = useDiscountAdmin();


  const stats = useMemo(
    () => ({
      total: data.length,
      active: data.filter((d) => d.isActive).length,
    }),
    [data],
  );

  useEffect(() => {
    if (!success) return;

    Swal.fire({
      title: "¡Descuento creado!",
      text: "El descuento fue creado exitosamente.",
      icon: "success",
    });

    setShowCreateModal(false);
  }, [success]);

  return (
    <>
      <NavbarGeneral />

      <div className="admin-discounts-page">
        {/* Header */}
        <header className="admin-discounts-page__header">
          <div className="admin-discounts-page__title-wrapper">
            <h1 className="admin-discounts-page__title">
              Gestión de Descuentos
            </h1>
          </div>
          <p className="admin-discounts-page__subtitle">
            Administra descuentos, cupones y promociones para tus productos
          </p>
        </header>

        {/* Actions */}
        <div className="admin-discounts-page__actions">
          <div className="admin-discounts-page__stats">
            <div>
              <span>Total</span>
              <strong>{listLoading ? "—" : stats.total}</strong>
            </div>
            <div>
              <span>Activos</span>
              <strong>{listLoading ? "—" : stats.active}</strong>
            </div>
          </div>

          <Button
            text="Nuevo Descuento"
            variant="create"
            onClick={() => setShowCreateModal(true)}
          />
        </div>

        {/* List */}
        <DiscountList
          data={data}
          loading={listLoading}
          onToggle={toggle}
        />

        {/* Modal */}
        <DiscountFormModal
          isOpen={showCreateModal}
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onCreate={submit}
          errors={fieldErrors}
          loading = {submitLoading}

        />

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </>
  );
};
