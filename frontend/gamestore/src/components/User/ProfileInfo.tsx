import { useAuth } from "@hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, 
  faUser, 
  faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/profileInfo.css";

export const ProfileInfo = () => {
  const { user } = useAuth();

  const formatRoles = (roles?: string[]) => {
    if (!roles || roles.length === 0) return "Sin rol asignado";
    return roles.length > 1 ? roles.join(", ") : roles[0];
  };

  const fields = [
    {
      icon: faEnvelope,
      label: "Email",
      value: user?.email || "No disponible",
      color: "#3b82f6"
    },
    {
      icon: faUser,
      label: "Usuario",
      value: user?.username || "No disponible",
      color: "#8b5cf6"
    },
    {
      icon: faShieldHalved,
      label: "Roles",
      value: formatRoles(user?.roles),
      color: "#10b981"
    }
  ];

  return (
    <section className="profile-card">
      <div className="profile-card__header">
        <div className="profile-card__title-wrapper">
          <h2 className="profile-card__title">Información personal</h2>

        </div>
        <p className="profile-card__subtitle">
          Detalles de tu cuenta y perfil
        </p>
      </div>

      <div className="profile-card__content">
        {fields.map((field) => (
          <div 
            key={field.label} 
            className="profile-field"
            style={{ "--field-color": field.color } as React.CSSProperties}
          >
            <div className="profile-field__icon">
              <FontAwesomeIcon icon={field.icon} />
            </div>
            <div className="profile-field__content">
              <span className="profile-field__label">{field.label}</span>
              <p className="profile-field__value">{field.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};