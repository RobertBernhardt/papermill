// /api/stripe-webhook.js
import Stripe from 'stripe';
import { Pool } from 'pg';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Disable body parsing, need the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    // Update payment record in database
    await pool.query(
      `UPDATE payments SET status = $1, customer_email = $2 WHERE payment_intent_id = $3`,
      ['succeeded', paymentIntent.receipt_email || null, paymentIntent.id]
    );
    
    // Here you would trigger your paper generation process
    console.log('Payment succeeded!', paymentIntent.id);
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    
    // Update payment record in database
    await pool.query(
      `UPDATE payments SET status = $1 WHERE payment_intent_id = $2`,
      ['failed', paymentIntent.id]
    );
    
    console.log('Payment failed!', paymentIntent.id);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
}