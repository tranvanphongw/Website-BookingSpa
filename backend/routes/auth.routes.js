const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolPromise, sql } = require('../config/db');

// Đăng ký người dùng (khách hàng hoặc admin)
router.post('/register', async (req, res) => {
  const { TEN, DCHI, DTHOAI, EMAIL, MATKHAU, ROLE } = req.body;
  try {
    const pool = await poolPromise; // Chờ kết nối hoàn tất và lấy pool
    const hashed = await bcrypt.hash(MATKHAU, 10);
    const request = pool.request();  // Sử dụng pool.request() sau khi đã có kết nối

    if (ROLE === 'admin') {
      // Đăng ký quản trị viên
      await request
        .input('TEN', sql.NVarChar, TEN)
        .input('DCHI', sql.NVarChar, DCHI)
        .input('DTHOAI', sql.VarChar, DTHOAI)
        .input('EMAIL', sql.VarChar, EMAIL)
        .input('MATKHAU', sql.VarChar, hashed)
        .query('INSERT INTO QUANTRIVIEN (TEN, DCHI, DTHOAI, EMAIL, MATKHAU) VALUES (@TEN, @DCHI, @DTHOAI, @EMAIL, @MATKHAU)');
    } else {
      // Đăng ký khách hàng
      await request
        .input('TEN', sql.NVarChar, TEN)
        .input('DCHI', sql.NVarChar, DCHI)
        .input('DTHOAI', sql.VarChar, DTHOAI)
        .input('EMAIL', sql.VarChar, EMAIL)
        .input('MATKHAU', sql.VarChar, hashed)
        .query('INSERT INTO KHACHHANG (TEN, DCHI, DTHOAI, EMAIL, MATKHAU) VALUES (@TEN, @DCHI, @DTHOAI, @EMAIL, @MATKHAU)');
    }

    res.json({ message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Đăng nhập người dùng (khách hàng hoặc admin)
router.post('/login', async (req, res) => {
  const { EMAIL, MATKHAU } = req.body;
  try {
    const pool = await poolPromise;

    // Kiểm tra người dùng có tồn tại trong bảng KHACHHANG
    const resultCustomer = await pool.request()
      .input('EMAIL', sql.VarChar, EMAIL)
      .query('SELECT * FROM KHACHHANG WHERE EMAIL = @EMAIL');

    // Kiểm tra người dùng có tồn tại trong bảng QUANTRIVIEN
    const resultAdmin = await pool.request()
      .input('EMAIL', sql.VarChar, EMAIL)
      .query('SELECT * FROM QUANTRIVIEN WHERE EMAIL = @EMAIL');

    let user = null;

    // Chọn người dùng từ một trong hai bảng
    if (resultCustomer.recordset.length > 0) {
      user = resultCustomer.recordset[0]; // Khách hàng
    } else if (resultAdmin.recordset.length > 0) {
      user = resultAdmin.recordset[0]; // Quản trị viên
    }

    // Nếu không tìm thấy người dùng
    if (!user) {
      return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
    }

    // Kiểm tra mật khẩu có đúng không
    const isMatch = await bcrypt.compare(MATKHAU, user.MATKHAU);

    if (!isMatch) {
      return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
    }

    // Tạo token và gửi về cho client
    const token = jwt.sign({ MAKH: user.MAKH, role: user.ROLE }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
