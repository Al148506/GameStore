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
import type { DiscountDetailDto } from "../types/discount/discount";
import { getDiscountById } from "../api/discountsApi";

export const AdminDiscountsPage = () => {
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: "create" | "edit";
    discount?: DiscountDetailDto;
  }>({
    open: false,
    mode: "create",
  });

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

    setModalState((prevState) => ({
      ...prevState,
      open: false,
    }));
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
            <div className="admin-discounts-page__stat">
              <span className="admin-discounts-page__stat-label">Total</span>
              <span className="admin-discounts-page__stat-value admin-discounts-page__stat-value--primary">
                {listLoading ? "—" : stats.total}
              </span>
            </div>
            <div className="admin-discounts-page__stat">
              <span className="admin-discounts-page__stat-label">Activos</span>
              <span className="admin-discounts-page__stat-value admin-discounts-page__stat-value--success">
                {listLoading ? "—" : stats.active}
              </span>
            </div>
          </div>
          <Button
            text="Nuevo Descuento"
            variant="create"
            onClick={() =>
              setModalState({
                open: true,
                mode: "create",
              })
            }
          />
        </div>

        {/* List */}
        <DiscountList
          data={data}
          loading={listLoading}
          onToggle={toggle}
          onEdit={async (discount) => {
            try {
              const fullDiscount = await getDiscountById(discount.id);

              setModalState({
                open: true,
                mode: "edit",
                discount: fullDiscount,
              });
            } catch (error) {
              console.error("Error cargando descuento", error);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo cargar el descuento para editar",
              });
            }
          }}
        />

        {/* Modal */}
        <DiscountFormModal
          isOpen={modalState.open}
          mode={modalState.mode}
          discountToEdit={modalState.discount}
          onClose={() =>
            setModalState((prevState) => ({ ...prevState, open: false }))
          }
          onCreate={submit}
          errors={fieldErrors}
          loading={submitLoading}
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
