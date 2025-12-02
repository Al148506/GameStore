import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

interface Props {
  onClose(): void;
}

export default function CheckoutForm({ onClose }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setMessage(null);

    // Confirm the payment (client-side). El servidor debe tener creado el PaymentIntent y haber devuelto clientSecret.
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Puedes indicar una return_url (opcional) o manejar resultado aquí
        return_url: `${window.location.origin}/payment-success`
      },
      // No redirigimos si deseas manejar en-page (pero con PaymentElement confirmPayment puede redirigir)
    });

    if (error) {
      setMessage(error.message ?? "Error en el pago");
      setIsProcessing(false);
    } else {
      // Si confirmPayment redirige, no llegamos aquí.
      // Si no redirige, puedes esperar evento o hacer polling, pero lo recomendable es usar return_url.
      setMessage("Procesando... si no eres redirigido, revisa tu correo o historial.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {message && <div className="stripe-message">{message}</div>}

      <button type="submit" disabled={!stripe || isProcessing} className="pay-btn">
        {isProcessing ? "Procesando..." : "Pagar"}
      </button>

      <button type="button" onClick={onClose} className="btn-link">Cancelar</button>
    </form>
  );
}
