const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./dbConfig/dbConfig');
const cors = require('cors');

const app = express();

// CORS Configuration (adjust with your frontend URL)
const corsOptions = {
  origin: 'https://payvia.vercel.app', // Update with your actual frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to Database
connectDB();

// Define routes for API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/funds', require('./routes/fundsRoutes'));

// Export the app (for Vercel's serverless function handler)
module.exports = app;


