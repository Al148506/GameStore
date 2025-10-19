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
