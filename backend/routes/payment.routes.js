const express = require('express');
const router = express.Router();

const { getAllPayments, addPayment, deletePayment } = require('../controllers/payment.controller');

// GET /api/payments
router.get('/', getAllPayments);

// POST /api/payments
router.post('/', addPayment);

// DELETE /api/payments/:MATHANHTOAN
router.delete('/:MATHANHTOAN', deletePayment);

module.exports = router;  