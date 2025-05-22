const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

router.get('/customers', bookingController.getCustomers);
router.get('/customers/:MAKH', bookingController.getCustomerById);
router.get('/service-types', bookingController.getServiceTypes);
router.get('/services', bookingController.getServices);
router.get('/employees', bookingController.getEmployees);

router.get('/', bookingController.getBookings);
router.post('/', bookingController.createBooking);
router.put('/', bookingController.updateBooking);
router.put('/:MALICH', bookingController.updateBooking);
router.get('/:MALICH', bookingController.getBookingById);
router.delete('/:MALICH', bookingController.cancelBooking);

module.exports = router;
