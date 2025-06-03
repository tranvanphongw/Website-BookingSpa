require('dotenv').config();
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');

// GET routes
router.get('/', scheduleController.getAllSchedules);
router.get('/date/:date', scheduleController.getSchedulesByDate);
router.get('/employee/:employeeId', scheduleController.getSchedulesByEmployee);

// POST route
router.post('/', scheduleController.addSchedule);

// PUT route
router.put('/:id', scheduleController.updateSchedule);

// DELETE route
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;