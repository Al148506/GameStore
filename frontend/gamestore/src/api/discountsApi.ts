import api from "./axios";
import  type {CreateDiscountRequest, DiscountListItem} from "../types/discount/discount"
import type { PaginatedResponse } from "../types/pagination/paginatedResponse";

type GetDiscountsParams = {
  page?: number;
  pageSize?: number;
};

export const createDiscount = async (payload: CreateDiscountRequest) => {
  const res = await api.post("/admin/discounts", payload);
  return res.data;
};

export const getDiscounts = async (params?: GetDiscountsParams): 
Promise<PaginatedResponse<DiscountListItem>>=> {
  const res = await api.get("/admin/discounts", {
    params,
  });
  return res.data;
};

export const toggleDiscount = async (id: string) => {
  await api.patch(`/admin/discounts/${id}/toggle`);
};
