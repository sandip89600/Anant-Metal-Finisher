const logger = require('../utils/logger');
const env = require('../config/env');

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: [${req.method}] ${req.originalUrl}`
  });
};

const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled Server Error', {
    message: err.message,
    name: err.name,
    path: req.originalUrl,
    method: req.method,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format provided for field: ${err.path}`
    });
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`
    });
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Handle JSON Web Token errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }

  // Generic 500 Server Error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal Server Error. Please try again later.' : err.message
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
