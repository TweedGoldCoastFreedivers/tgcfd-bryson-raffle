import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ticketCount, email } = req.body;

  const TICKET_PRICE_CENTS = 2000; // $20.00 in cents
  const MAX_TICKETS = 10;

  if (
    !email ||
    typeof ticketCount !== "number" ||
    ticketCount < 1 ||
    ticketCount > MAX_TICKETS
  ) {
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              name: "TGCFD Bryson Raffle Ticket",
              description: `${ticketCount} ticket${ticketCount > 1 ? "s" : ""} to support Bryson Sheehy`,
            },
            unit_amount: TICKET_PRICE_CENTS,
          },
          quantity: ticketCount,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
      customer_email: email,
      metadata: {
        ticketCount: ticketCount.toString(),
      },
      payment_intent_data: {
        statement_descriptor: "TGCFD Bryson Raffle",
      },
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
