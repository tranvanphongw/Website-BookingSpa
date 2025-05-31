const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

router.get('/summary', reportController.getSummaryReport);
router.get('/monthly-revenue', reportController.getMonthlyRevenueReport); // thêm route này

module.exports = router;
