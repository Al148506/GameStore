import React from "react";
import "../styles/button.css";
function Button({
  text,
  editButton,
  manejarClic,
}: {
  text: React.ReactNode;
  editButton: boolean;
  manejarClic: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 🧱 Detiene la propagación hacia la card
    manejarClic(e);
  };
  return (
    <button
      className={`custom-btn ${editButton ? "edit-btn" : "delete-btn"}`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
}
export default Button;
