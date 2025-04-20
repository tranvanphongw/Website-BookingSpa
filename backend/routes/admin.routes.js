const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth'); // Import middleware bảo vệ cho admin
const { getAllServices, addService, updateService, deleteService } = require('../controllers/service.controller');

// Các route dành cho admin, bảo vệ bằng middleware adminAuth
router.get('/services', adminAuth, getAllServices);  // Lấy danh sách dịch vụ cho admin
router.post('/services', adminAuth, addService);     // Thêm dịch vụ cho admin
router.put('/services/:id', adminAuth, updateService); // Cập nhật dịch vụ cho admin
router.delete('/services/:id', adminAuth, deleteService); // Xóa dịch vụ cho admin

module.exports = router;
