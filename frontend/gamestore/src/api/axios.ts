import axios from "axios";
import { clearAuthStorage } from "@utils/clearAuthStorage";
import { clearCartStorage } from "@utils/clearCartStorage";

const baseURL = import.meta.env.VITE_API_URL;
const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
  timeout: 10000, // 10s
});

// Interceptor para añadir token JWT si existe
api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para refresco de token en 401
api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url ?? "";
    const isPublicRoute = PUBLIC_ROUTES.some((route) => url.includes(route));
    if (status === 401 && !isPublicRoute) {
      clearAuthStorage();
      clearCartStorage();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
