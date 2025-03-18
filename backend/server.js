const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const papersRoute = require('./routes/papers');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/papers', papersRoute);

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to The Paper Mill API' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});