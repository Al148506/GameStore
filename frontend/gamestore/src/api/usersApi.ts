import api from "./axios";
import type { PaginatedResponse } from "../types/pagination/paginatedResponse";
import type {
  UserQuery,
  UserWithRoles,
  changePasswordRequestDto,
} from "../types/auth/auth";

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

export const changePassword = async (payload: changePasswordRequestDto) => {
  const res = await api.put("Auth/change-password", { payload });
  return res.data;
};
