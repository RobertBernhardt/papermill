const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Uncomment the line below if using SSL (e.g., for production or Heroku)
  // ssl: { rejectUnauthorized: false }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database', err);
  } else {
    console.log('Database connection established');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};