const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const blogRoutes = require('./blogRoutes');
const enquiryRoutes = require('./enquiryRoutes');
const settingsRoutes = require('./settingsRoutes');
const adminRoutes = require('./adminRoutes');
const galleryRoutes = require('./galleryRoutes');
const { getCategories } = require('../controllers/productController');
const { submitContact, submitQuote } = require('../controllers/enquiryController');
const { submissionLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { contactEnquirySchema, quoteEnquirySchema } = require('../validators/enquiryValidators');

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    company: 'Anant Metal Finishers',
    brand: 'AMF',
    location: 'MIDC Ambad, Nashik, Maharashtra'
  });
});

// Category alias directly under /api/v1/categories
router.get('/categories', getCategories);

// Direct enquiry endpoints required by prompt specification:
// POST /api/v1/contact
// POST /api/v1/quotes
router.post('/contact', submissionLimiter, validate(contactEnquirySchema), submitContact);
router.post('/quotes', submissionLimiter, validate(quoteEnquirySchema), submitQuote);

// Main sub-routers
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/capabilities', productRoutes); // Capability showcase alias
router.use('/gallery', galleryRoutes); // Gallery and Our Work portfolio
router.use('/work', galleryRoutes); // Alias for work portfolio
router.use('/blog', blogRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/settings', settingsRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
