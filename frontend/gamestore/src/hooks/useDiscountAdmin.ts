import { useState } from "react";
import type {
  CreateDiscountRequest,
  UpdateDiscountRequest,
} from "../types/discount/discount";
import { createDiscount, updateDiscount } from "../api/discountsApi";
import axios, { AxiosError } from "axios";

export const useDiscountAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const normalizeErrors = (errors: Record<string, string[]>) => {
    return Object.fromEntries(
      Object.entries(errors).map(([key, value]) => [
        key.charAt(0).toLowerCase() + key.slice(1),
        value,
      ]),
    );
  };

  const submit = async (payload: CreateDiscountRequest) => {
    console.group("🧪 useDiscountAdmin.submit");

    try {
      setLoading(true);
      setError(null);
      setFieldErrors({});
      setSuccess(false);

      console.log("📦 Payload enviado:", payload);

      await createDiscount(payload);

      console.log("✅ Descuento creado correctamente");
      setSuccess(true);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.data) {
        const data = e.response.data as {
          title?: string;
          message?: string;
          errors?: Record<string, string[]>;
        };

        // 1️⃣ Errores por campo
        if (data.errors) {
          const normalized = normalizeErrors(data.errors);
          setFieldErrors(normalized);
          setError(null);
          return;
        }

        // 2️⃣ Error de negocio / global
        if (data.message) {
          setError(data.message);
          setFieldErrors({});
          return;
        }

        // 3️⃣ Fallback
        setError(data.title ?? "Error al crear el descuento");
      } else {
        setError("Error de conexión o error inesperado");
      }
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  const update = async (id: string, payload: UpdateDiscountRequest) => {
    try {
      setLoading(true);
      setFieldErrors({});
      setSuccess(false);

      await updateDiscount(id, payload); // API

      setSuccess(true);
    } catch (e) {
      if (e instanceof AxiosError && e.response?.data) {
        const data = e.response.data;

        console.log("📛 Response data:", data);

        if (data.errors) {
          const normalized = normalizeErrors(data.errors);
          console.log("🧩 Errores normalizados:", normalized);
          setFieldErrors(normalized);
        }

        setError(data.title ?? data.message ?? "Error al crear el descuento");
      } else {
        setError("Error de conexión o error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return { submit, update, loading, error, fieldErrors, success };
};
