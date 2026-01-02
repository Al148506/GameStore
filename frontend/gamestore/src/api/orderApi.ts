import api from "./axios";
import type { PaginatedResponse } from "../types/pagination/paginatedResponse";
import type { OrderDto } from "../types/order/order";
export const orderApi = {
  getLastOder: async () => {
    const res = await api.get("/orders/last-order");
    return res.data;
  },

  getHistory: async ({
    page,
    pageSize,
    sort,
  }: {
    page: number;
    pageSize: number;
    sort: string;
  }) => {
    const res = await api.get<PaginatedResponse<OrderDto>>("/orders/history", {
      params: { page, pageSize, sort },
    });

    return res.data;
  },
};
