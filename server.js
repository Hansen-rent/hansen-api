const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const decapProxyRoutes = require('./routes/decapProxyRoutes');
const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorHandler');
const { errorResponse } = require('./utils/response');

dotenv.config();

const app = express();

// Middlewares
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://hansen-admin.netlify.app',
    'https://hansen-fe.netlify.app',
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
app.use(cors(corsOptions));
// app.options('/*', cors(corsOptions));

app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: {
      code: 429,
      message: 'Забагато запитів в вашого IP. Спробуйте пізніше.',
    },
  },
});

app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/decap-proxy', decapProxyRoutes);

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
