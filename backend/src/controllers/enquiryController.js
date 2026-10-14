const Enquiry = require('../models/Enquiry');
const { createEnquiry } = require('../services/enquiryService');
const logger = require('../utils/logger');

// PUBLIC: Submit contact enquiry
const submitContact = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    const enquiry = await createEnquiry(
      {
        ...req.body,
        enquiryType: 'contact'
      },
      ipAddress
    );

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been received successfully. Our team will review your requirements.',
      referenceNumber: enquiry.referenceNumber,
      createdAt: enquiry.createdAt
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC: Submit quote request
const submitQuote = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    const enquiry = await createEnquiry(
      {
        ...req.body,
        enquiryType: 'quote'
      },
      ipAddress
    );

    res.status(201).json({
      success: true,
      message: 'Your request for quote has been submitted. Our technical team will review your component specifications.',
      referenceNumber: enquiry.referenceNumber,
      createdAt: enquiry.createdAt
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get all enquiries with filtering and pagination
const adminGetEnquiries = async (req, res, next) => {
  try {
    const { status, type, read, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (type && type !== 'all') {
      query.enquiryType = type;
    }

    if (read === 'true') {
      query.isRead = true;
    } else if (read === 'false') {
      query.isRead = false;
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { referenceNumber: { $regex: s, $options: 'i' } },
        { name: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { companyName: { $regex: s, $options: 'i' } },
        { phone: { $regex: s, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [items, total, countByStatus, unreadTotal, readTotal] = await Promise.all([
      Enquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Enquiry.countDocuments(query),
      Enquiry.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Enquiry.countDocuments({ isRead: false }),
      Enquiry.countDocuments({ isRead: true })
    ]);

    const statusCounts = {
      all: total,
      new: 0,
      in_progress: 0,
      completed: 0,
      spam: 0,
      unread: unreadTotal,
      read: readTotal
    };

    countByStatus.forEach((item) => {
      if (statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count;
      }
    });

    res.status(200).json({
      success: true,
      data: items,
      statusCounts,
      unreadTotal,
      readTotal,
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

// ADMIN: Get single enquiry details
const adminGetEnquiryById = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }
    res.status(200).json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Update enquiry status
const adminUpdateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    enquiry.status = status;
    await enquiry.save();

    logger.info(`Enquiry status updated: ${enquiry.referenceNumber} -> ${status}`);

    res.status(200).json({
      success: true,
      message: `Enquiry status marked as ${status}`,
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Add internal note
const adminAddInternalNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    enquiry.internalNotes.push({
      note,
      author: req.user?.name || 'Administrator',
      createdAt: new Date()
    });

    await enquiry.save();

    res.status(200).json({
      success: true,
      message: 'Internal note added successfully',
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Export enquiries to CSV
const adminExportCsv = async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (type && type !== 'all') query.enquiryType = type;

    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 }).lean();

    // Build CSV
    const headers = [
      'Reference Number',
      'Date',
      'Type',
      'Status',
      'Name',
      'Company',
      'Email',
      'Phone',
      'Related Service',
      'Component Name',
      'Quantity',
      'Material',
      'Finish',
      'Target Date',
      'Message'
    ];

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = enquiries.map((e) => [
      escapeCsv(e.referenceNumber),
      escapeCsv(new Date(e.createdAt).toISOString().split('T')[0]),
      escapeCsv(e.enquiryType),
      escapeCsv(e.status),
      escapeCsv(e.name),
      escapeCsv(e.companyName),
      escapeCsv(e.email),
      escapeCsv(e.phone),
      escapeCsv(e.relatedProductOrService),
      escapeCsv(e.requirements?.componentName || ''),
      escapeCsv(e.requirements?.estimatedQuantity || ''),
      escapeCsv(e.requirements?.material || ''),
      escapeCsv(e.requirements?.requiredFinish || ''),
      escapeCsv(e.requirements?.targetDate || ''),
      escapeCsv(e.message)
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=enquiries-export-${new Date().toISOString().split('T')[0]}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// ADMIN: Toggle read/unread status
const adminToggleRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    enquiry.isRead = typeof isRead === 'boolean' ? isRead : !enquiry.isRead;
    await enquiry.save();

    res.status(200).json({
      success: true,
      message: `Enquiry marked as ${enquiry.isRead ? 'read' : 'unread'}`,
      data: enquiry
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Delete enquiry message
const adminDeleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    logger.info(`Enquiry deleted: ${enquiry.referenceNumber} (ID: ${id})`);

    res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
  submitQuote,
  adminGetEnquiries,
  adminGetEnquiryById,
  adminUpdateStatus,
  adminAddInternalNote,
  adminExportCsv,
  adminToggleRead,
  adminDeleteEnquiry
};
