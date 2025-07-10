import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Home() {
  const [ticketCount, setTicketCount] = useState(1);
  const [email, setEmail] = useState("");
  const [prizesText, setPrizesText] = useState(
    "Prizes worth $2000+ to be announced!"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const TICKET_PRICE = 20;
  const MAX_TICKETS = 10;
  const TOTAL_TICKETS_AVAILABLE = 500;

  const handleCheckout = async () => {
    setError("");
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    if (ticketCount < 1 || ticketCount > MAX_TICKETS) {
      setError(`You can purchase between 1 and ${MAX_TICKETS} tickets.`);
      return;
    }

    setLoading(true);

    try {
      const stripe = await stripePromise;

      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketCount,
          email,
        }),
      });

      const session = await response.json();

      if (session.error) {
        setError(session.error);
        setLoading(false);
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to initiate checkout. Try again.");
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        maxWidth: 480,
        margin: "2rem auto",
        fontFamily:
          "'Trebuchet MS', Verdana, Tahoma, sans-serif",
        padding: "1rem",
        background: "#e0f7fa",
        borderRadius: "8px",
        boxShadow: "0 0 10px #00796b",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#00695c" }}>
        TGCFD Bryson Sheehy Spearfishing Raffle
      </h1>

      <label htmlFor="prizes" style={{ fontWeight: "bold", marginTop: 20 }}>
        Raffle Prizes (editable):
      </label>
      <textarea
        id="prizes"
        rows={3}
        value={prizesText}
        onChange={(e) => setPrizesText(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          fontSize: 16,
          borderRadius: 4,
          border: "1px solid #00796b",
          resize: "vertical",
        }}
      />

      <p style={{ marginTop: 12, fontStyle: "italic", color: "#004d40" }}>
        Total tickets available: {TOTAL_TICKETS_AVAILABLE} <br />
        Ticket price: ${TICKET_PRICE} each <br />
        Max tickets per buyer: {MAX_TICKETS}
      </p>

      <label htmlFor="ticketCount" style={{ fontWeight: "bold" }}>
        Number of tickets to purchase:
      </label>
      <input
        type="number"
        id="ticketCount"
        min={1}
        max={MAX_TICKETS}
        value={ticketCount}
        onChange={(e) => setTicketCount(Number(e.target.value))}
        style={{ width: "100%", padding: 8, fontSize: 16, borderRadius: 4 }}
      />

      <label htmlFor="email" style={{ fontWeight: "bold", marginTop: 12 }}>
        Email address:
      </label>
      <input
        type="email"
        id="email"
        value={email}
        placeholder="you@example.com"
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 8, fontSize: 16, borderRadius: 4 }}
      />

      {error && (
        <p style={{ color: "red", marginTop: 8, fontWeight: "bold" }}>
          {error}
        </p>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          marginTop: 20,
          width: "100%",
          padding: "12px",
          backgroundColor: "#00796b",
          color: "white",
          fontWeight: "bold",
          fontSize: 18,
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Processing..." : `Pay $${ticketCount * TICKET_PRICE}`}
      </button>

      <footer style={{ marginTop: 30, fontSize: 12, color: "#004d40", textAlign: "center" }}>
        Tweed Gold Coast Freedivers Club — ABN: 48605570540
      </footer>
    </main>
  );
}
