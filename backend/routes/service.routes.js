const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth'); // Middleware kiểm tra quyền Admin
const { getAllServices, addService, getAllCategories,updateService, deleteService } = require('../controllers/service.controller');

// Route lấy danh sách dịch vụ, hỗ trợ lọc tìm kiếm và nhóm theo loại dịch vụ
router.get('/', getAllServices);

// Route lấy danh sách loại dịch vụ
router.get('/categories', getAllCategories);


// Route thêm dịch vụ
router.post('/', addService);

// Route cập nhật dịch vụ
router.put('/:id', updateService);

// Route xóa dịch vụ
router.delete('/:id', deleteService);

module.exports = router;
