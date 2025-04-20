// === backend/routes/rating.routes.js ===
const express = require('express');
const router = express.Router();
const { poolConnect, sql } = require('../config/db');

// Lấy tất cả các đánh giá
router.get('/', async (req, res) => {
  try {
    await poolConnect;
    const result = await poolConnect.request().query('SELECT * FROM DANHGIA');
    res.json(result.recordset);  // Trả về tất cả các đánh giá
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm đánh giá mới
router.post('/add', async (req, res) => {
  const { MAKH, MANV, SOSAO, BINHLUAN } = req.body;
  try {
    await poolConnect;
    const request = poolConnect.request();
    await request
      .input('MAKH', sql.Int, MAKH)
      .input('MANV', sql.Int, MANV)
      .input('SOSAO', sql.Int, SOSAO)
      .input('BINHLUAN', sql.NVarChar, BINHLUAN)
      .query('INSERT INTO DANHGIA (MAKH, MANV, SOSAO, BINHLUAN) VALUES (@MAKH, @MANV, @SOSAO, @BINHLUAN)');
    res.json({ message: 'Đánh giá thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lấy đánh giá theo nhân viên
router.get('/employee/:id', async (req, res) => {
  const { id } = req.params;  // Nhân viên theo ID
  try {
    await poolConnect;
    const result = await poolConnect.request()
      .input('MANV', sql.Int, id)
      .query('SELECT * FROM DANHGIA WHERE MANV = @MANV');
    res.json(result.recordset);  // Trả về đánh giá cho nhân viên cụ thể
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
