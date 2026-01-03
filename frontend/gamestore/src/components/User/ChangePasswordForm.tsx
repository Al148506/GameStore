import { useState } from "react";
import { changePassword } from "../../api/usersApi";
import { useAuth } from "@hooks/useAuth";
import type { changePasswordRequestDto } from "../../types/auth/auth";
import { PasswordInput } from "@components/auth/PasswordInput";
import { usePasswordValidation } from "@hooks/usePasswordValidation";
export const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { user } = useAuth();
  const { rules, isValid: validPassword } = usePasswordValidation(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;

    const payload: changePasswordRequestDto = {
      email: user.email,
      password: currentPassword,
      newPassword: newPassword,
    };

    try {
      await changePassword(payload);
      alert("Contraseña actualizada correctamente");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error(error);
      alert("Error al cambiar la contraseña");
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
          isValid={validPassword}
          rules={rules}
        />

        <PasswordInput
          label="Nueva contraseña"
          value={newPassword}
          onChange={setNewPassword}
          isValid={validPassword}
          rules={rules}
        />

        <button type="submit" disabled={!validPassword }>Actualizar contraseña</button>
      </form>
    </section>
  );
};
