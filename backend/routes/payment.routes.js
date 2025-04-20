const express = require('express');
const router = express.Router();
const { poolConnect, sql } = require('../config/db');

// Lấy tất cả giao dịch thanh toán
router.get('/', async (req, res) => {
  try {
    await poolConnect;
    const result = await poolConnect.request().query('SELECT * FROM THANHTOAN');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm giao dịch thanh toán
router.post('/', async (req, res) => {
  const { MALICH, MAKH, SOTIEN, NGAYTHANHTOAN, HINHTHUCTHANHTOAN } = req.body;
  try {
    await poolConnect;
    const request = poolConnect.request();
    await request
      .input('MALICH', sql.Int, MALICH)
      .input('MAKH', sql.Int, MAKH)
      .input('SOTIEN', sql.Decimal, SOTIEN)
      .input('NGAYTHANHTOAN', sql.DateTime, NGAYTHANHTOAN)
      .input('HINHTHUCTHANHTOAN', sql.NVarChar, HINHTHUCTHANHTOAN)
      .query('INSERT INTO THANHTOAN (MALICH, MAKH, SOTIEN, NGAYTHANHTOAN, HINHTHUCTHANHTOAN) VALUES (@MALICH, @MAKH, @SOTIEN, @NGAYTHANHTOAN, @HINHTHUCTHANHTOAN)');
    res.json({ message: 'Giao dịch thanh toán đã được thực hiện thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
