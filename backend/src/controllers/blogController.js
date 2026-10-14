const Blog = require('../models/Blog');
const slugify = require('../utils/slugify');
const sanitizeHtmlContent = require('../utils/sanitizeHtml');
const logger = require('../utils/logger');

// Estimate reading time helper (approx 200 words/min)
const calculateReadingTime = (text) => {
  if (!text) return '2 min read';
  const clean = text.replace(/<[^>]*>/g, ' ');
  const words = clean.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

// PUBLIC: Get published blog posts
const getBlogs = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 9 } = req.query;

    const query = { isPublished: true };

    if (category && category !== 'All') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { summary: { $regex: search.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(search.trim(), 'i')] } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Blog.find(query)
        .sort({ publicationDate: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('-content') // Exclude full rich text from list for fast payload
        .lean(),
      Blog.countDocuments(query)
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

// PUBLIC: Get single blog post by slug
const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await Blog.findOne({
      slug: slug.toLowerCase(),
      isPublished: true
    }).lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog article not found or currently unpublished.'
      });
    }

    // Fetch related published posts
    const related = await Blog.find({
      _id: { $ne: post._id },
      category: post.category,
      isPublished: true
    })
      .sort({ publicationDate: -1 })
      .limit(3)
      .select('title slug summary coverImage readingTime publicationDate')
      .lean();

    res.status(200).json({
      success: true,
      data: post,
      related
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC: Get blog categories
const getBlogCategories = async (req, res, next) => {
  try {
    const categories = await Blog.distinct('category', { isPublished: true });
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get all posts
const adminGetBlogs = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status === 'published') query.isPublished = true;
    if (status === 'draft') query.isPublished = false;

    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { summary: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('-content'),
      Blog.countDocuments(query)
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

// ADMIN: Get single post by ID (with full content)
const adminGetBlogById = async (req, res, next) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Create post
const adminCreateBlog = async (req, res, next) => {
  try {
    const data = req.body;

    let slug = data.slug ? slugify(data.slug) : slugify(data.title);
    const existing = await Blog.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const sanitizedContent = sanitizeHtmlContent(data.content);
    const readingTime = calculateReadingTime(sanitizedContent);

    const blog = new Blog({
      ...data,
      slug,
      content: sanitizedContent,
      readingTime: data.readingTime || readingTime
    });

    const saved = await blog.save();
    logger.info(`Blog post created: ${saved.title} (ID: ${saved._id})`);

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: saved
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Update post
const adminUpdateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    if (data.slug && data.slug !== blog.slug) {
      const newSlug = slugify(data.slug);
      const conflict = await Blog.findOne({ slug: newSlug, _id: { $ne: id } });
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'Another blog post with this slug already exists.'
        });
      }
      data.slug = newSlug;
    }

    if (data.content) {
      data.content = sanitizeHtmlContent(data.content);
      data.readingTime = calculateReadingTime(data.content);
    }

    Object.assign(blog, data);
    const updated = await blog.save();

    logger.info(`Blog post updated: ${updated.title} (ID: ${updated._id})`);

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Delete post
const adminDeleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    logger.info(`Blog post deleted: ${blog.title} (ID: ${id})`);

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  getBlogCategories,
  adminGetBlogs,
  adminGetBlogById,
  adminCreateBlog,
  adminUpdateBlog,
  adminDeleteBlog
};
