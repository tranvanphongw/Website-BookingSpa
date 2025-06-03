require('dotenv').config();
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');

// GET routes
router.get('/', employeeController.getAllEmployees);
router.get('/test', employeeController.testConnection);
router.get('/:id', employeeController.getEmployeeById);
router.get('/worked-with/:makh', employeeController.getWorkedWithByCustomerId);

// POST route
router.post('/', employeeController.createEmployee);

// PUT route
router.put('/:id', employeeController.updateEmployee);

// DELETE route
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;