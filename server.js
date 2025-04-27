const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorHandler');
const { errorResponse } = require('./utils/response');

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/auth', authRoutes);

// обработка несуществующих роутов (опционально)
app.use((req, res) => {
  errorResponse(res, {
    statusCode: 404,
    message: 'Route not found',
  });
});

// глобальный обработчик ошибок
app.use(errorHandler);

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
