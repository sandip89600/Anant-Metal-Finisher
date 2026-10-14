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
  adminExportCsv,
  adminToggleRead,
  adminDeleteEnquiry
} = require('../controllers/enquiryController');
const { updateStatusSchema, addNoteSchema } = require('../validators/enquiryValidators');

// Gallery Controller
const {
  adminGetGallery,
  adminCreateGalleryItem,
  adminUpdateGalleryItem,
  adminDeleteGalleryItem
} = require('../controllers/galleryController');
const { gallerySchema, galleryUpdateSchema } = require('../validators/galleryValidators');

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

// Product & Capability Management
router.get('/products', adminGetProducts);
router.post('/products', validate(productSchema), adminCreateProduct);
router.get('/products/:id', adminGetProductById);
router.patch('/products/:id', validate(productUpdateSchema), adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

// Capability routes alias
router.get('/capabilities', adminGetProducts);
router.post('/capabilities', validate(productSchema), adminCreateProduct);
router.get('/capabilities/:id', adminGetProductById);
router.patch('/capabilities/:id', validate(productUpdateSchema), adminUpdateProduct);
router.delete('/capabilities/:id', adminDeleteProduct);

// Gallery & Our Work Portfolio Management
router.get('/gallery', adminGetGallery);
router.post('/gallery', validate(gallerySchema), adminCreateGalleryItem);
router.patch('/gallery/:id', validate(galleryUpdateSchema), adminUpdateGalleryItem);
router.delete('/gallery/:id', adminDeleteGalleryItem);

// Blog Management
router.get('/blog', adminGetBlogs);
router.post('/blog', validate(blogSchema), adminCreateBlog);
router.get('/blog/:id', adminGetBlogById);
router.patch('/blog/:id', validate(blogUpdateSchema), adminUpdateBlog);
router.delete('/blog/:id', adminDeleteBlog);

// Enquiry / Message Management
router.get('/enquiries', adminGetEnquiries);
router.get('/enquiries/export', adminExportCsv);
router.get('/enquiries/:id', adminGetEnquiryById);
router.patch('/enquiries/:id/status', validate(updateStatusSchema), adminUpdateStatus);
router.patch('/enquiries/:id/read', adminToggleRead);
router.delete('/enquiries/:id', adminDeleteEnquiry);
router.post('/enquiries/:id/notes', validate(addNoteSchema), adminAddInternalNote);

// Messages alias
router.get('/messages', adminGetEnquiries);
router.patch('/messages/:id/read', adminToggleRead);
router.delete('/messages/:id', adminDeleteEnquiry);

// Company Settings
router.get('/settings', adminGetSettings);
router.patch('/settings', validate(companySettingsSchema), adminUpdateSettings);

// Media Upload
router.post('/upload', uploadSingleImage);

module.exports = router;
