const express = require('express');
const router = express.Router();
const { getAllServices, addService, getAllCategories, getServiceById, updateService, deleteService } = require('../controllers/service.controller');
const upload = require('../middleware/upload');
const adminAuth = require('../middleware/adminAuth'); // Middleware kiểm tra quyền Admin

// Route lấy tất cả dịch vụ
router.get('/', getAllServices);

// Route lấy tất cả loại dịch vụ
router.get('/categories', getAllCategories);

// Route lấy dịch vụ theo ID để edit
router.get('/:id', getServiceById);

// Route thêm dịch vụ
router.post('/', upload, addService);

// Route cập nhật dịch vụ
router.put('/:id', upload, updateService);

// Route xóa dịch vụ
router.delete('/:id', deleteService);

module.exports = router;
