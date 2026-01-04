import { useState } from "react";
import { changePassword } from "../api/usersApi";
import type { changePasswordRequestDto } from "../types/auth/auth";
import Swal from "sweetalert2";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const submitChangePassword = async (
    payload: changePasswordRequestDto,
    onSuccess?: () => void
  ) => {
    setLoading(true);

    try {
      await changePassword(payload);

      await Swal.fire({
        title: "Contraseña actualizada",
        text: "Tu contraseña ha sido actualizada exitosamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      onSuccess?.();
    } catch (error) {
      const err = error as Error & { response?: { data: unknown } };
      console.log(err.response?.data);
      const errors = err.response?.data;
      if (Array.isArray(errors)) {
        await Swal.fire({
          title: "Error al cambiar la contraseña",
          html: errors
            .map((e: { description: string }) => `<p>• ${e.description}</p>`)
            .join(""),
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } else {
        await Swal.fire({
          title: "Error al cambiar la contraseña",
          text: "No se pudo cambiar la contraseña",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitChangePassword,
  };
};
