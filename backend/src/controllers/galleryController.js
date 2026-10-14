const Gallery = require('../models/Gallery');
const logger = require('../utils/logger');

// PUBLIC: Get gallery items with optional category filtering
const getPublicGallery = async (req, res, next) => {
  try {
    const { category, featured, limit = 50, page = 1 } = req.query;
    const query = {};

    if (category && category !== 'All' && category !== 'all') {
      query.category = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const pageNum = Math.max(1, parseInt(page, 10));
    const skip = (pageNum - 1) * limitNum;

    const [items, total, categoriesCount] = await Promise.all([
      Gallery.find(query)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Gallery.countDocuments(query),
      Gallery.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: items,
      categoriesCount,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC: Get items for "Our Work" portfolio
const getPublicWork = async (req, res, next) => {
  try {
    const { category, limit = 50 } = req.query;
    const query = { isWorkItem: true };

    if (category && category !== 'All' && category !== 'all') {
      query.category = category;
    }

    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const items = await Gallery.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC: Get single gallery item
const getGalleryItemById = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get all gallery items with search and filters
const adminGetGallery = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 30 } = req.query;
    const query = {};

    if (category && category !== 'all' && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { title: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Gallery.find(query)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Gallery.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Create gallery item
const adminCreateGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.create(req.body);
    logger.info(`Gallery item created: ${item.title} (ID: ${item._id})`);

    res.status(201).json({
      success: true,
      message: 'Gallery item added successfully',
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Update gallery item
const adminUpdateGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    logger.info(`Gallery item updated: ${item.title} (ID: ${item._id})`);

    res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully',
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Delete gallery item
const adminDeleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    logger.info(`Gallery item deleted: ${item.title} (ID: ${item._id})`);

    res.status(200).json({
      success: true,
      message: 'Gallery item removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicGallery,
  getPublicWork,
  getGalleryItemById,
  adminGetGallery,
  adminCreateGalleryItem,
  adminUpdateGalleryItem,
  adminDeleteGalleryItem
};
