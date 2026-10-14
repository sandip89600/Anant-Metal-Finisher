const Product = require('../models/Product');
const slugify = require('../utils/slugify');
const logger = require('../utils/logger');

// PUBLIC: Get published and verified products/services
const getProducts = async (req, res, next) => {
  try {
    const { category, search, type, page = 1, limit = 12 } = req.query;

    const query = {
      isPublished: true,
      isVerified: true
    };

    if (category && category !== 'All') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (type) {
      query.itemType = type;
    }

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { summary: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Product.find(query)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query)
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

// PUBLIC: Get single product/service by slug
const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const item = await Product.findOne({
      slug: slug.toLowerCase(),
      isPublished: true,
      isVerified: true
    }).lean();

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Product or service not found or currently unverified.'
      });
    }

    // Also fetch 3 related published services
    const related = await Product.find({
      _id: { $ne: item._id },
      category: item.category,
      isPublished: true,
      isVerified: true
    })
      .limit(3)
      .select('name slug category summary mainImage')
      .lean();

    res.status(200).json({
      success: true,
      data: item,
      related
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC: Get categories of published items
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category', {
      isPublished: true,
      isVerified: true
    });
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get all products (including drafts and unverified)
const adminGetProducts = async (req, res, next) => {
  try {
    const { status, verified, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (status === 'published') query.isPublished = true;
    if (status === 'draft') query.isPublished = false;

    if (verified === 'verified') query.isVerified = true;
    if (verified === 'unverified') query.isVerified = false;

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Product.find(query)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query)
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

// ADMIN: Get product by ID
const adminGetProductById = async (req, res, next) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Product or service not found'
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

// ADMIN: Create product or service
const adminCreateProduct = async (req, res, next) => {
  try {
    const data = req.body;

    let slug = data.slug ? slugify(data.slug) : slugify(data.name);
    // Ensure slug uniqueness
    const existing = await Product.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const product = new Product({
      ...data,
      slug
    });

    const saved = await product.save();
    logger.info(`Product created: ${saved.name} (ID: ${saved._id})`);

    res.status(201).json({
      success: true,
      message: 'Product/service created successfully',
      data: saved
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Update product or service
const adminUpdateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product/service not found'
      });
    }

    if (data.slug && data.slug !== product.slug) {
      const newSlug = slugify(data.slug);
      const conflict = await Product.findOne({ slug: newSlug, _id: { $ne: id } });
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'Another product with this slug already exists.'
        });
      }
      data.slug = newSlug;
    }

    Object.assign(product, data);
    const updated = await product.save();

    logger.info(`Product updated: ${updated.name} (ID: ${updated._id})`);

    res.status(200).json({
      success: true,
      message: 'Product/service updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Delete product or service
const adminDeleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product/service not found'
      });
    }

    logger.info(`Product deleted: ${product.name} (ID: ${id})`);

    res.status(200).json({
      success: true,
      message: 'Product/service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  getCategories,
  adminGetProducts,
  adminGetProductById,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct
};
