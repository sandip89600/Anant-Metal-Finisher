const express = require('express');
const router = express.Router();
const {
  getPublicGallery,
  getPublicWork,
  getGalleryItemById
} = require('../controllers/galleryController');

// GET /api/v1/gallery
router.get('/', getPublicGallery);

// GET /api/v1/gallery/work
router.get('/work', getPublicWork);

// GET /api/v1/gallery/:id
router.get('/:id', getGalleryItemById);

module.exports = router;
