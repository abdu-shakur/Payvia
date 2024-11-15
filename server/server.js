const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./dbConfig/dbConfig');
const cors = require('cors');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: ['https://payvia.vercel.app', 'http://localhost:3000'], // Add your local development URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to Database
connectDB();

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Payvia API is running" });
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/funds', require('./routes/fundsRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
module.exports = app;