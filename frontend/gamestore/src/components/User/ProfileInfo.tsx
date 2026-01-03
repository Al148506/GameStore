import { useAuth } from "@hooks/useAuth";
import "../../styles/profileInfo.css";

export const ProfileInfo = () => {
  const { user } = useAuth();

  return (
    <section className="profile-card">
      <h2 className="profile-card__title">Información</h2>

      <div className="profile-card__info">
        <p className="profile-card__field">
          <strong>Email:</strong> {user?.email}
        </p>
        <p className="profile-card__field">
          <strong>Usuario:</strong> {user?.username}
        </p>
        <p className="profile-card__field">
          <strong>Roles:</strong>{" "}
          {user?.roles && user.roles.length > 1
            ? user.roles.join(", ")
            : user?.roles?.[0]}
        </p>
      </div>
    </section>
  );
};
