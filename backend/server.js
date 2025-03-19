const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const papersRoute = require('./routes/papers');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - enhanced to allow requests from Live Server
const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Enable CORS with the enhanced options
app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use('/api/papers', papersRoute);

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to The Paper Mill API' });
});

// Add a specific route to test CORS
app.get('/api/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS is working correctly!',
    origin: req.headers.origin 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS enabled for origins: ${corsOptions.origin.join(', ')}`);
});