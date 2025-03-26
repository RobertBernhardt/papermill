// /api/create-payment-intent.js
import Stripe from 'stripe';
import { Pool } from 'pg';

// More robust initialization
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  console.error('Missing STRIPE_SECRET_KEY environment variable');
  // We'll handle this error in the request handler
}

// Initialize Stripe only if we have a key
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

// Initialize database connection with error handling
let pool;
try {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('Missing DATABASE_URL environment variable');
    // We'll continue without a DB connection
  } else {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false }
    });
  }
} catch (error) {
  console.error('Error initializing database connection:', error);
  // We'll handle this in the request handler
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Handle missing Stripe configuration
  if (!stripe) {
    return res.status(500).json({ 
      error: 'Stripe is not configured. Please check server environment variables.' 
    });
  }

  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents and ensure it's an integer
      currency,
      metadata,
      automatic_payment_methods: { enabled: true }
    });

    // Store record in database if connection exists
    if (pool) {
      try {
        await pool.query(
          `INSERT INTO payments 
           (payment_intent_id, amount, currency, status, metadata) 
           VALUES ($1, $2, $3, $4, $5)`,
          [
            paymentIntent.id,
            Math.round(amount * 100),
            currency,
            'created',
            metadata
          ]
        );
      } catch (dbError) {
        // Log DB error but don't fail the request
        console.error('Database error:', dbError);
        // Continue without DB record - payment can still work
      }
    }

    // Return client secret to frontend
    return res.status(200).json({ 
      clientSecret: paymentIntent.client_secret 
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // Provide more helpful error messages based on Stripe error types
    if (error.type === 'StripeAuthenticationError') {
      return res.status(500).json({ 
        error: 'Invalid Stripe API key. Please check server configuration.' 
      });
    } else if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: `Stripe request error: ${error.message}` 
      });
    }
    
    return res.status(500).json({ 
      error: 'Payment intent creation failed', 
      details: error.message 
    });
  }
}