// /api/stripe-webhook.js
import Stripe from 'stripe';
import { Pool } from 'pg';
import { buffer } from 'micro';

// More robust initialization
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  console.error('Missing STRIPE_SECRET_KEY environment variable');
}

if (!webhookSecret) {
  console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
}

// Initialize Stripe only if we have a key
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

// Disable body parsing, need the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize database connection with error handling
let pool;
try {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('Missing DATABASE_URL environment variable');
  } else {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false }
    });
  }
} catch (error) {
  console.error('Error initializing database connection:', error);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  // Handle missing configuration
  if (!stripe || !webhookSecret) {
    return res.status(500).json({ 
      error: 'Stripe is not properly configured. Check server environment variables.' 
    });
  }

  let event;
  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).send('Missing stripe-signature header');
    }

    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      // Update payment record in database if connection exists
      if (pool) {
        try {
          await pool.query(
            `UPDATE payments SET status = $1, customer_email = $2 WHERE payment_intent_id = $3`,
            ['succeeded', paymentIntent.receipt_email || null, paymentIntent.id]
          );
        } catch (dbError) {
          console.error('Database error updating payment:', dbError);
          // Continue even if DB update fails
        }
      }
      
      // Process the successful payment
      console.log('Payment succeeded!', paymentIntent.id);
      // Here you would add code to trigger your paper generation process
      
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      
      // Update payment record in database if connection exists
      if (pool) {
        try {
          await pool.query(
            `UPDATE payments SET status = $1 WHERE payment_intent_id = $2`,
            ['failed', paymentIntent.id]
          );
        } catch (dbError) {
          console.error('Database error updating payment:', dbError);
          // Continue even if DB update fails
        }
      }
      
      console.log('Payment failed!', paymentIntent.id);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).send(`Webhook processing error: ${err.message}`);
  }
}