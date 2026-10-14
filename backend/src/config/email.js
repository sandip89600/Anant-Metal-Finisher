const nodemailer = require('nodemailer');
const env = require('./env');
const logger = require('../utils/logger');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!env.SMTP_HOST || !env.SMTP_USER) {
    logger.warn('SMTP configuration is missing. Outbound email notifications will be simulated and logged.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });

  return transporter;
};

module.exports = { getTransporter };
