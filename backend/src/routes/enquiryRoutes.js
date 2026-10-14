const express = require('express');
const router = express.Router();
const { submitContact, submitQuote } = require('../controllers/enquiryController');
const { submissionLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { contactEnquirySchema, quoteEnquirySchema } = require('../validators/enquiryValidators');

router.post('/contact', submissionLimiter, validate(contactEnquirySchema), submitContact);
router.post('/quotes', submissionLimiter, validate(quoteEnquirySchema), submitQuote);

module.exports = router;
