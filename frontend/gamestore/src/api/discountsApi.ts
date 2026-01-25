import api from "./axios";
import  type {CreateDiscountRequest} from "../types/discount/discount"


export const createDiscount = async (payload: CreateDiscountRequest) => {
  const res = await api.post("/admin/discounts", payload);
  return res.data;
};
