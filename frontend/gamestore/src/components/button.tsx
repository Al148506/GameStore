import React from "react";
import "../styles/button.css";

interface ButtonProps {
  text: React.ReactNode;
  variant?: "default" | "edit" | "delete" | "add";
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}
 export default function Button({ text, variant = "default", onClick }: ButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick(e);
  };

 return (
    <button className={`custom-btn ${variant}`} onClick={handleClick}>
      {text}
    </button>
  );
}
