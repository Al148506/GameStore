import { useState } from "react";
import { changePassword } from "../../api/usersApi";
import { useAuth } from "@hooks/useAuth";
import type { changePasswordRequestDto } from "../../types/auth/auth";
import { PasswordInput } from "@components/auth/PasswordInput";
import { usePasswordValidation } from "@hooks/usePasswordValidation";
import Swal from "sweetalert2";

export const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordsMatch = newPassword === confirmPassword;

  const { user } = useAuth();
  const { rules, isValid: isNewPasswordValid } =
    usePasswordValidation(newPassword);

  const canSubmit =
    currentPassword.length > 0 &&
    isNewPasswordValid &&
    passwordsMatch &&
    !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !canSubmit) return;
    setLoading(true);

    const payload: changePasswordRequestDto = {
      email: user.email,
      password: currentPassword,
      newPassword: newPassword,
    };

    try {
      await changePassword(payload);
      await Swal.fire({
        title: "Contraseña actualizada",
        text: "Tu contraseña ha sido actualizada exitosamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const err = error as Error & { response?: { data: unknown } };
      console.log(err.response?.data);
      const errors = err.response?.data;
      if (Array.isArray(errors)) {
        await Swal.fire({
          title: "Error al cambiar la contraseña",
          html: errors.map((e: { description: string }) => `<p>• ${e.description}</p>`).join(""),
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } else {
        await Swal.fire({
          title: "Error al cambiar la contraseña",
          text: err.message,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="profile-card">
      <h2 className="profile-card__title">Cambiar contraseña</h2>

      <form onSubmit={handleSubmit}>
        <PasswordInput
          label="Contraseña actual"
          value={currentPassword}
          onChange={setCurrentPassword}
          isValid={currentPassword.length > 0}
        />

        <PasswordInput
          label="Nueva contraseña"
          value={newPassword}
          onChange={setNewPassword}
          isValid={isNewPasswordValid}
          rules={rules}
        />

        <PasswordInput
          label="Confirmar nueva contraseña"
          value={confirmPassword}
          onChange={setConfirmPassword}
          isValid={passwordsMatch && confirmPassword.length > 0}
        />

        <button type="submit" disabled={!canSubmit}>
          {loading ? "Actualizando..." : "Actualizar contraseña"}
        </button>
      </form>
    </section>
  );
};
