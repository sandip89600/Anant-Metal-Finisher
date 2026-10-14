/**
 * Structured logger utility with timestamp and log levels.
 * Automatically avoids logging sensitive information.
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

function formatMessage(level, message, meta = null) {
  const timestamp = new Date().toISOString();
  let metaString = '';
  if (meta) {
    // Redact sensitive keys if present
    const cleanMeta = JSON.parse(JSON.stringify(meta, (key, value) => {
      if (/password|token|secret|authorization|cookie/i.test(key)) {
        return '[REDACTED]';
      }
      return value;
    }));
    metaString = ` | ${JSON.stringify(cleanMeta)}`;
  }
  return `[${timestamp}] [${level}] ${message}${metaString}`;
}

const logger = {
  info: (msg, meta) => console.log(formatMessage(LOG_LEVELS.INFO, msg, meta)),
  warn: (msg, meta) => console.warn(formatMessage(LOG_LEVELS.WARN, msg, meta)),
  error: (msg, meta) => console.error(formatMessage(LOG_LEVELS.ERROR, msg, meta)),
  debug: (msg, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatMessage(LOG_LEVELS.DEBUG, msg, meta));
    }
  }
};

module.exports = logger;
