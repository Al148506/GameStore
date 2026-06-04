import api from "@shared/api/httpClient";
import type { PaginatedResponse } from "@shared/types/paginatedResponse";
import type {
  UserQuery,
  UserWithRoles,
  changePasswordRequestDto,
} from "@features/auth/types/auth";

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
  const res = await api.put("/Auth/change-password", payload);
  return res.data;
};
