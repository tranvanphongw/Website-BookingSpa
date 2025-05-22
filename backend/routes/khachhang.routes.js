const express = require('express');
const router = express.Router();
const khachhangController = require('../controllers/khachhang.controller');

// GET và PUT theo MAKH
router.get('/:id', khachhangController.getKhachHangById);
router.put('/:id', khachhangController.updateKhachHang);

module.exports = router;
