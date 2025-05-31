const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Tạo đơn thanh toán MoMo
router.post('/create', paymentController.createPayment);

// Callback khi thanh toán xong redirect về (returnUrl)
router.get('/return', paymentController.paymentReturn);

// Webhook notify MoMo gọi để thông báo trạng thái thanh toán
router.post('/notify', paymentController.paymentNotify);

router.get('/all', paymentController.getAllPayments);
router.get('/customer/:MAKH', paymentController.getPaymentsByCustomer);
router.get('/booking/:MALICH', paymentController.getPaymentsByBooking);


module.exports = router;
