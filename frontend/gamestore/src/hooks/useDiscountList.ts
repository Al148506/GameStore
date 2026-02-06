import { useCallback, useEffect, useState } from "react";
import { getDiscounts, toggleDiscount } from "../api/discountsApi";
import type { DiscountListItem } from "../types/discount/discount";
import type { PaginatedResponse } from "../types/pagination/paginatedResponse";

export const useDiscountList = () => {
  const [response, setResponse] =
    useState<PaginatedResponse<DiscountListItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const load = useCallback(async (pageToLoad: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await getDiscounts({
        page: pageToLoad,
        pageSize: 7,
      });

      setResponse(res);
      setPage(pageToLoad);
    } catch (e) {
      console.error("❌ Error cargando descuentos:", e);
      setError("No se pudieron cargar los descuentos");
    } finally {
      setLoading(false);
    }
  }, []);

  const toggle = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await toggleDiscount(id);
        await load(page); // recarga la página actual
      } catch (e) {
        console.error("❌ Error al cambiar estado del descuento:", e);
        setError("No se pudo actualizar el descuento");
      } finally {
        setLoading(false);
      }
    },
    [load, page],
  );

  useEffect(() => {
    load(1);
  }, [load]);

  return {
    data: response?.items ?? [],
    page,
    pageSize: response?.pageSize ?? 7,
    total: response?.total ?? 0,
    totalPages:
      response && response.pageSize
        ? Math.ceil(response.total / response.pageSize)
        : 0,
    loading,
    error,
    setPage: load,
    reload: () => load(page),
    toggle,
  };
};
