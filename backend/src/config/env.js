require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/anant_metal_finishers',
  JWT_SECRET: process.env.JWT_SECRET || 'anant_metal_finishers_super_secure_jwt_secret_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'amf_cookie_secret_key_2026',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  COOKIE_SECURE: process.env.NODE_ENV === 'production',
  COOKIE_SAME_SITE: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  
  // SMTP Email Settings
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'no-reply@anantmetalfinishers.com',
  NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL || ''
};

module.exports = env;
