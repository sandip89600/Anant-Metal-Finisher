const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Enquiry = require('../models/Enquiry');

const getDashboardMetrics = async (req, res, next) => {
  try {
    const [
      publishedProducts,
      draftProducts,
      publishedBlogs,
      draftBlogs,
      newEnquiries,
      inProgressEnquiries,
      completedEnquiries,
      totalEnquiries,
      recentEnquiries,
      recentProducts,
      recentBlogs
    ] = await Promise.all([
      Product.countDocuments({ isPublished: true, isVerified: true }),
      Product.countDocuments({ $or: [{ isPublished: false }, { isVerified: false }] }),
      Blog.countDocuments({ isPublished: true }),
      Blog.countDocuments({ isPublished: false }),
      Enquiry.countDocuments({ status: 'new' }),
      Enquiry.countDocuments({ status: 'in_progress' }),
      Enquiry.countDocuments({ status: 'completed' }),
      Enquiry.countDocuments(),
      Enquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
      Product.find().sort({ createdAt: -1 }).limit(4).select('name slug category isPublished isVerified').lean(),
      Blog.find().sort({ createdAt: -1 }).limit(4).select('title slug isPublished publicationDate').lean()
    ]);

    // Monthly enquiries breakdown for last 6 months for real charts
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyEnquiries = await Enquiry.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            type: '$enquiryType'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        products: {
          published: publishedProducts,
          draft: draftProducts,
          total: publishedProducts + draftProducts
        },
        blogs: {
          published: publishedBlogs,
          draft: draftBlogs,
          total: publishedBlogs + draftBlogs
        },
        enquiries: {
          new: newEnquiries,
          inProgress: inProgressEnquiries,
          completed: completedEnquiries,
          total: totalEnquiries
        },
        recentEnquiries,
        recentProducts,
        recentBlogs,
        monthlyTrends: monthlyEnquiries
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardMetrics
};
