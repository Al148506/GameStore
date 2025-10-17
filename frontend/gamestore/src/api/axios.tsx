// src/api/axios.js
import axios from "axios";

const baseURL = "https://localhost:7250/";

const api = axios.create({
  baseURL,
  timeout: 10000, // 10s
});

// Interceptor para añadir token JWT si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // o donde guardes token
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Opcional: interceptor de respuesta para refresco de token en 401
api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    if (error.response?.status === 401) {
      // aquí podrías intentar refresh token o redirigir al login
    }
    return Promise.reject(error);
  }
);

export default api;
