const express = require('express');
const router = express.Router();
const { poolConnect, sql } = require('../config/db');

// Lấy tất cả lịch đặt
router.get('/', async (req, res) => {
  try {
    await poolConnect;
    const result = await poolConnect.request().query('SELECT * FROM LICHDAT');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm lịch đặt
router.post('/', async (req, res) => {
  const { MAKH, MANV, MADV, THOIGIANBATDAU, THOIGIANKETTHUC, TRANGTHAI } = req.body;
  try {
    await poolConnect;
    const request = poolConnect.request();
    await request
      .input('MAKH', sql.Int, MAKH)
      .input('MANV', sql.Int, MANV)
      .input('MADV', sql.Int, MADV)
      .input('THOIGIANBATDAU', sql.DateTime, THOIGIANBATDAU)
      .input('THOIGIANKETTHUC', sql.DateTime, THOIGIANKETTHUC)
      .input('TRANGTHAI', sql.NVarChar, TRANGTHAI)
      .query('INSERT INTO LICHDAT (MAKH, MANV, MADV, THOIGIANBATDAU, THOIGIANKETTHUC, TRANGTHAI) VALUES (@MAKH, @MANV, @MADV, @THOIGIANBATDAU, @THOIGIANKETTHUC, @TRANGTHAI)');
    res.json({ message: 'Lịch đặt đã được tạo thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
