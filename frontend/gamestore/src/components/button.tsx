import React from "react";
import "../styles/button.css";

interface ButtonProps {
  text: React.ReactNode;
  variant?: "default" | "edit" | "delete" | "add" | "create" | "disabled"| "closesession";
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}
export default function Button({
  text,
  variant = "default",
  onClick,
}: ButtonProps) {

  const isDisabled = variant === "disabled";
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
     if (!isDisabled) {
      onClick(e);
    }
  };

  return (
    <button className={`custom-btn ${variant}`} onClick={handleClick} disabled={isDisabled} >
      {text}
    </button>
  );
}
