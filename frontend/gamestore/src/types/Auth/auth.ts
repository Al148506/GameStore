export interface RegisterRequestDto {
  email: string;
  password: string;
}
export interface LoginRequestDto {
  email: string;
  password: string;
}
export interface AuthResponseDto {
  accessToken: string;
  email: string;
  roles: string[];
}

export interface UserWithRoles {
  id: string;
  userName: string;
  email: string;
  roles: string[];
}

export interface UserQuery {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface changePasswordRequestDto{
  email: string;
  password: string;
  newPassword: string;
}

