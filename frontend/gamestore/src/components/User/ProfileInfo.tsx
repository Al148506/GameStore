import { useAuth } from "@hooks/useAuth";

export const ProfileInfo = () => {
  const { user } = useAuth();

  return (
    <section className="profile-card">
      <h2>Información</h2>

      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Usuario:</strong> {user?.username}</p>
      <p><strong>Rol:</strong> {user?.role}</p>
    </section>
  );
};
