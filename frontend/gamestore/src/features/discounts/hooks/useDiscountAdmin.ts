import { useState } from "react";
import type {
  CreateDiscountRequest,
  UpdateDiscountRequest,
} from "../types/discount";
import { createDiscount, updateDiscount } from "../api/discountsApi";
import axios, { AxiosError } from "axios";

export const useDiscountAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const normalizeErrors = (errors: Record<string, string[]>) => {
    return Object.fromEntries(
      Object.entries(errors).map(([key, value]) => [
        key.charAt(0).toLowerCase() + key.slice(1),
        value,
      ]),
    );
  };

  const submit = async (payload: CreateDiscountRequest): Promise<boolean> => {
    console.group("🧪 useDiscountAdmin.submit");

    try {
      setLoading(true);
      setError(null);
      setFieldErrors({});
      setCreateSuccess(false);
      await createDiscount(payload);
      setCreateSuccess(true);
      return true;
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
        }

        // 2️⃣ Error de negocio / global
        if (data.message) {
          setError(data.message);
          setFieldErrors({});
        }
        // 3️⃣ Fallback
        setError(data.title ?? "Error al crear el descuento");
        return false;
      } else {
        setError("Error de conexión o error inesperado");
        return false;
      }
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  const update = async (
    id: string,
    payload: UpdateDiscountRequest,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setFieldErrors({});
      setUpdateSuccess(false);

      await updateDiscount(id, payload); // API
      setUpdateSuccess(true);
      return true;
    } catch (e) {
      if (e instanceof AxiosError && e.response?.data) {
        const data = e.response.data;

        console.log("📛 Response data:", data);

        if (data.errors) {
          const normalized = normalizeErrors(data.errors);
          console.log("🧩 Errores normalizados:", normalized);
          setFieldErrors(normalized);
        }

        setError(
          data.title ?? data.message ?? "Error al actualizar el descuento",
        );
        return false;
      } else {
        setError("Error de conexión o error inesperado");
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    submit,
    update,
    loading,
    error,
    fieldErrors,
    createSuccess,
    updateSuccess,
  };
};
