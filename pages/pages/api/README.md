# TGCFD Bryson Raffle Fundraiser App

This is a simple web app to sell raffle tickets online in support of Bryson Sheehy, hosted by the Tweed Gold Coast Freedivers Club.

---

## Features

- Online raffle ticket sales at $20 each
- Max 10 tickets per buyer
- Editable prize description on frontend
- Stripe integration for secure card payments
- Deployable on Vercel (free hosting)

---

## Setup (for developers)

1. Clone this repo
2. Create a `.env.local` file and add your Stripe keys:

---

## Deployment (via Vercel)

1. Go to https://vercel.com/new and import this repo.
2. When prompted, set the environment variables:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (your Stripe publishable key)
- `STRIPE_SECRET_KEY` (your Stripe secret key)
3. Click Deploy.

---

## About

- Club: Tweed Gold Coast Freedivers (ABN: 48605570540)
- Stripe statement label: **TGCFD Bryson Raffle**
