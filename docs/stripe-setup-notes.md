# Stripe secure activation setup

This project now supports secure Stripe activation through webhook events.

## Required env vars (Netlify)

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_URL` (or `VITE_SUPABASE_URL`)
- `SUPABASE_SERVICE_ROLE_KEY`

## Webhook endpoint

- URL: `https://cineworkflo.com/.netlify/functions/stripe-webhook`
- Events to send:
  - `checkout.session.completed` (Stripe UI may show “Checkout session completed”)
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.paid`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

## Behavior

1. Checkout session is created with `user_id` in metadata.
2. Webhook verifies Stripe signature.
3. Webhook updates Supabase auth user metadata:
   - `is_pro`
   - `pro_status`
   - `pro_expires_at`
   - `stripe_customer_id`
   - `stripe_subscription_id`

## Notes

- Frontend no longer grants Pro from local storage on success page.
- Pro access is now tied to verified Stripe webhook events.
- "Unlimited" is enforced as fair-use with server-side rate limits and daily caps (configurable via Netlify env vars `CWF_*`).
