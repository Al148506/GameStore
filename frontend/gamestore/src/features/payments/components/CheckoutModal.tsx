import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// lee la key desde env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK );

interface Props {
  clientSecret: string;
  onClose(): void;
}

export default function CheckoutModal({ clientSecret, onClose }: Props) {

  const options = {
    clientSecret,
    appearance: {} // opcional: personaliza apariencia
  };

  // Simple modal básico; reemplaza con tu propio modal si quieres
  return (
    <div className="checkout-modal-overlay">
      <div className="checkout-modal">
        <button className="close-btn" onClick={onClose}>X</button>

        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
}
