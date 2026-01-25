import { useState } from "react";
import { createDiscount } from "../api/discountsApi";
import type { createDiscountRequest } from "../api/discountsApi";

export const useDiscountAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async (payload: CreateDiscountRequest) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await createDiscount(payload);
      setSuccess(true);
    } catch (e) {
      const error = e as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message ?? "Error creating discount");
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error, success };
};
