import { useState } from "react";
import { useAuth } from "@hooks/useAuth";
import type { changePasswordRequestDto } from "../../types/auth/auth";
import { PasswordInput } from "@components/auth/PasswordInput";
import { usePasswordValidation } from "@hooks/usePasswordValidation";
import { useChangePassword } from "@hooks/useChangePassword";

export const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { user } = useAuth();
  const { rules, isValid: isNewPasswordValid } =
    usePasswordValidation(newPassword);

  const { loading, submitChangePassword } = useChangePassword();

  const passwordsMatch = newPassword === confirmPassword;

  const canSubmit =
    currentPassword.length > 0 &&
    isNewPasswordValid &&
    passwordsMatch &&
    !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || !canSubmit) return;

    const payload: changePasswordRequestDto = {
      email: user.email,
      password: currentPassword,
      newPassword,
    };

    await submitChangePassword(payload, () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    });
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
