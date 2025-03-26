// /api/create-payment-intent.js
import Stripe from 'stripe';
import { Pool } from 'pg';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // convert to cents
      currency,
      metadata,
      automatic_payment_methods: { enabled: true }
    });

    // Store initial record in database
    await pool.query(
      `INSERT INTO payments 
       (payment_intent_id, amount, currency, status, metadata) 
       VALUES ($1, $2, $3, $4, $5)`,
      [
        paymentIntent.id,
        amount * 100,
        currency,
        'created',
        metadata
      ]
    );

    // Return client secret to frontend
    return res.status(200).json({ 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Payment intent creation failed' });
  }
}