import api from "./axios";
import type { PaginatedResponse } from "../types/Pagination/paginatedResponse";
import type { UserQuery, UserWithRoles } from "../types/Auth/auth";

export const getUsers = async (params: UserQuery) => {
  const res = await api.get<PaginatedResponse<UserWithRoles>>("/Auth/list", {
    params,
  });
  return res.data;
};

export const updateUserRole = async (userId: string) => {
  const res = await api.put(`/Auth/toggle-admin/${userId}`);
  return res.data;
};
