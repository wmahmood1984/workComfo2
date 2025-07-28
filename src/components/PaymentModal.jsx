// PaymentModal.jsx
import { useState } from "react";

export default function PaymentModal({ open, onClose,paying }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  if (!open) return null; // nothing to render if the modal isn't open

  const handleSubmit = (e) => {
    e.preventDefault();
    // ── pretend a payment API call succeeds ──
    onClose(true); // tell the parent: “paymentMade = true”
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[90%] md:w-1/2 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Dummy Credit‑Card Payment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring"
            required
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring"
              required
            />
            <input
              type="text"
              placeholder="CVC"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 font-semibold transition"
          >
          {paying ? "Paying...":"Confirm Payment"}  
          </button>

          <button
            type="button"
            onClick={() => onClose(false)} // closed without paying
            className="w-full mt-2 text-gray-600 underline"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
