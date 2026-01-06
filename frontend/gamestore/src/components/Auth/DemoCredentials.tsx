import { useState } from "react";
import "../../styles/DemoCredentials.css";

interface DemoCredentialsProps {
  email: string;
  password: string;
  onFillCredentials: (email: string, password: string) => void;
}

export default function DemoCredentials({
  email,
  password,
  onFillCredentials,
}: DemoCredentialsProps) {
  const [copied, setCopied] = useState(false);

  const handleFillAndCopy = async () => {
    try {
      // Copiar ambos al clipboard (formato claro)
      await navigator.clipboard.writeText(
        `Email: ${email}\nPassword: ${password}`
      );

      // Autocompletar login
      onFillCredentials(email, password);

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Clipboard error", error);
    }
  };

  return (
    <section className="demo-credentials">
      <h3 className="demo-credentials__title">Credenciales demo</h3>

      <p className="demo-credentials__info">
       Usa estas credenciales para probar la aplicación
      </p>

      <button
        type="button"
        className="demo-credentials__fill-btn"
        onClick={handleFillAndCopy}
      >
        {copied ? "Credenciales copiadas ✓" : "Usar credenciales demo"}
      </button>
    </section>
  );
}
