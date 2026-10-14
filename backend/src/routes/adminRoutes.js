const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Product Controller
const {
  adminGetProducts,
  adminGetProductById,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct
} = require('../controllers/productController');
const { productSchema, productUpdateSchema } = require('../validators/productValidators');

// Blog Controller
const {
  adminGetBlogs,
  adminGetBlogById,
  adminCreateBlog,
  adminUpdateBlog,
  adminDeleteBlog
} = require('../controllers/blogController');
const { blogSchema, blogUpdateSchema } = require('../validators/blogValidators');

// Enquiry Controller
const {
  adminGetEnquiries,
  adminGetEnquiryById,
  adminUpdateStatus,
  adminAddInternalNote,
  adminExportCsv
} = require('../controllers/enquiryController');
const { updateStatusSchema, addNoteSchema } = require('../validators/enquiryValidators');

// Settings & Dashboard Controllers
const {
  adminGetSettings,
  adminUpdateSettings
} = require('../controllers/settingsController');
const { companySettingsSchema } = require('../validators/settingsValidators');
const { getDashboardMetrics } = require('../controllers/dashboardController');
const { uploadSingleImage } = require('../controllers/uploadController');

// All routes here require authentication
router.use(authenticateAdmin);

// Dashboard
router.get('/dashboard', getDashboardMetrics);

// Product & Service Management
router.get('/products', adminGetProducts);
router.post('/products', validate(productSchema), adminCreateProduct);
router.get('/products/:id', adminGetProductById);
router.patch('/products/:id', validate(productUpdateSchema), adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

// Blog Management
router.get('/blog', adminGetBlogs);
router.post('/blog', validate(blogSchema), adminCreateBlog);
router.get('/blog/:id', adminGetBlogById);
router.patch('/blog/:id', validate(blogUpdateSchema), adminUpdateBlog);
router.delete('/blog/:id', adminDeleteBlog);

// Enquiry Management
router.get('/enquiries', adminGetEnquiries);
router.get('/enquiries/export', adminExportCsv);
router.get('/enquiries/:id', adminGetEnquiryById);
router.patch('/enquiries/:id/status', validate(updateStatusSchema), adminUpdateStatus);
router.post('/enquiries/:id/notes', validate(addNoteSchema), adminAddInternalNote);

// Company Settings
router.get('/settings', adminGetSettings);
router.patch('/settings', validate(companySettingsSchema), adminUpdateSettings);

// Media Upload
router.post('/upload', uploadSingleImage);

module.exports = router;
