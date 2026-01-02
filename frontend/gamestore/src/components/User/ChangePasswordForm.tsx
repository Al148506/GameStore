import { useState } from "react";
import { changePassword } from "../../api/usersApi";
import { useAuth } from "@hooks/useAuth";
import type { changePasswordRequestDto } from "../../types/Auth/auth";
export const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { user } = useAuth();

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
      <h2>Cambiar contraseña</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Contraseña actual"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit">Actualizar contraseña</button>
      </form>
    </section>
  );
};
