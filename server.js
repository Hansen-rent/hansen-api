const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;

const init = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`),
    );

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('SIGINT signal received: closing HTTP server');
      await mongoose.connection.close();
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Error while server init', error);
  }
};

init();
