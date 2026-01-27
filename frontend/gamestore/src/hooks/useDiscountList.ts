import { useEffect, useState } from "react";
import { getDiscounts, toggleDiscount } from "../api/discountsApi";
import type { DiscountListItem } from "../types/discount/discount";
import type { PaginatedResponse } from "../types/pagination/paginatedResponse";

export const useDiscountList = () => {
  const [response, setResponse] =
    useState<PaginatedResponse<DiscountListItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const load = async (pageToLoad = page) => {
    setLoading(true);
    const res = await getDiscounts({
      page: pageToLoad,
      pageSize: 7,
    });
    setResponse(res);
    setPage(pageToLoad);
    setLoading(false);
  };

  const toggle = async (id: string) => {
    await toggleDiscount(id);
    await load();
  };

  useEffect(() => {
    load(1);
  }, []);

  return {
    data: response?.items ?? [],
    page: response?.page ?? 1,
    pageSize: response?.pageSize ?? 20,
    total: response?.total ?? 0,
    totalPages: Math.ceil((response?.total ?? 0) / (response?.pageSize ?? 20)),
    loading,
    setPage: load,
    toggle,
  };
};
