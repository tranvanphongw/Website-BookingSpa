const express = require('express');
const router = express.Router();
const { poolConnect, sql } = require('../config/db');

// Lấy tất cả nhân viên
router.get('/', async (req, res) => {
  try {
    await poolConnect;
    const result = await poolConnect.request().query('SELECT * FROM NHANVIEN');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm nhân viên
router.post('/', async (req, res) => {
  const { TEN, DCHI, DTHOAI, CHUYENMON, DIEMDANHGIA, HINHANH } = req.body;
  try {
    await poolConnect;
    const request = poolConnect.request();
    await request
      .input('TEN', sql.NVarChar, TEN)
      .input('DCHI', sql.NVarChar, DCHI)
      .input('DTHOAI', sql.VarChar, DTHOAI)
      .input('CHUYENMON', sql.NVarChar, CHUYENMON)
      .input('DIEMDANHGIA', sql.Float, DIEMDANHGIA)
      .input('HINHANH', sql.NVarChar, HINHANH)
      .query('INSERT INTO NHANVIEN (TEN, DCHI, DTHOAI, CHUYENMON, DIEMDANHGIA, HINHANH) VALUES (@TEN, @DCHI, @DTHOAI, @CHUYENMON, @DIEMDANHGIA, @HINHANH)');
    res.json({ message: 'Nhân viên đã được thêm thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
