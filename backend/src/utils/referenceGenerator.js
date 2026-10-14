const crypto = require('crypto');

function generateReferenceNumber(prefix = 'AMP-ENQ') {
  const year = new Date().getFullYear();
  const randomChars = crypto.randomBytes(3).toString('hex').toUpperCase();
  const timestampPart = Date.now().toString().slice(-4);
  return `${prefix}-${year}-${randomChars}${timestampPart}`;
}

module.exports = generateReferenceNumber;
