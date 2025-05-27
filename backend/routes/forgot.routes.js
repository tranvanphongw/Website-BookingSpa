const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const forgotController = require('../controllers/forgot.controller');

// Middleware validate input
const validateForgot = [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateReset = [
  body('token').notEmpty().withMessage('Token không được để trống'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

router.post('/forgot-password', validateForgot, forgotController.forgotPassword);
router.post('/reset-password', validateReset, forgotController.resetPassword);

module.exports = router;
