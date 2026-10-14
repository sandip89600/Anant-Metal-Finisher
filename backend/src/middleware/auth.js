const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Admin = require('../models/Admin');
const logger = require('../utils/logger');

const authenticateAdmin = async (req, res, next) => {
  try {
    let token = null;

    // First check HttpOnly cookie
    if (req.cookies && req.cookies.amp_token) {
      token = req.cookies.amp_token;
    } 
    // Fallback to Bearer token in Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to access this resource.'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Session invalid or expired. Please log in again.'
      });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Administrator account not found or has been deactivated.'
      });
    }

    req.user = admin;
    next();
  } catch (error) {
    logger.error('Error in authentication middleware', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).json({
      success: false,
      message: 'Access restricted. Superadmin privileges required.'
    });
  }
  next();
};

module.exports = {
  authenticateAdmin,
  requireSuperAdmin
};
