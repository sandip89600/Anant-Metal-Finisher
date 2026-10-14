const express = require('express');
const router = express.Router();
const { login, logout, getMe, changePassword } = require('../controllers/authController');
const { authenticateAdmin } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { loginSchema, changePasswordSchema } = require('../validators/authValidators');

router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authenticateAdmin, getMe);
router.post('/change-password', authenticateAdmin, validate(changePasswordSchema), changePassword);

module.exports = router;
