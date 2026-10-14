const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const env = require('../config/env');
const logger = require('../utils/logger');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

// Set secure HttpOnly cookie helper
const setAuthCookie = (res, token) => {
  const isProduction = env.NODE_ENV === 'production';
  res.cookie('amp_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Contact the administrator.'
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id);
    setAuthCookie(res, token);

    logger.info(`Admin logged in successfully: ${admin.email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token, // Also returned for API client flexibility
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  const isProduction = env.NODE_ENV === 'production';
  res.clearCookie('amp_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      lastLogin: req.user.lastLogin
    }
  });
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.user._id);

    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.'
      });
    }

    admin.password = newPassword;
    await admin.save();

    logger.info(`Password changed for admin: ${admin.email}`);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  getMe,
  changePassword
};
