const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const env = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');

const app = express();

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration with strict allowlist
const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server or curl/Postman requests (where origin is undefined)
    if (!origin) return callback(null, true);
    
    if (env.ALLOWED_ORIGINS.indexOf(origin) !== -1 || env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      logger.warn(`Blocked by CORS policy: ${origin}`);
      callback(new Error('Origin not permitted by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

app.use(cors(corsOptions));

// HTTP Request logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    skip: (req) => req.url === '/api/v1/health'
  }));
}

// Body parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser(env.COOKIE_SECRET));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// General API rate limiter
app.use('/api', generalLimiter);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Anant Metal Finishers API',
    version: '1.0.0',
    location: 'G-8, MIDC Ambad, Nashik, Maharashtra, India – 422010',
    documentation: '/api/v1/health'
  });
});

// Mount API v1
app.use('/api/v1', routes);

// 404 Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
