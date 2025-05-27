const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { poolPromise, sql } = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('EMAIL', sql.VarChar, email)
      .query('SELECT * FROM KHACHHANG WHERE EMAIL = @EMAIL');

    if (result.recordset.length === 0) {
      // Không nên trả trực tiếp email không tồn tại để tránh lộ thông tin
      return res.json({ message: 'Nếu email tồn tại, chúng tôi đã gửi mail đặt lại mật khẩu!' });
    }

    const user = result.recordset[0];

    const token = jwt.sign(
      { MAKH: user.MAKH },
      process.env.SECRET_KEY,
      { expiresIn: '15m' }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Đặt lại mật khẩu - Spa Booking',
      html: `<p>Click vào link dưới để đặt lại mật khẩu:</p><a href="${resetLink}">${resetLink}</a>`
    });

    res.json({ message: 'Nếu email tồn tại, chúng tôi đã gửi mail đặt lại mật khẩu!' });
  } catch (error) {
    console.error('Forgot error:', error);
    res.status(500).json({ message: 'Lỗi server!' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const hashed = await bcrypt.hash(newPassword, 10);

    const pool = await poolPromise;
    await pool.request()
      .input('MAKH', sql.Int, decoded.MAKH)
      .input('MATKHAU', sql.VarChar, hashed)
      .query('UPDATE KHACHHANG SET MATKHAU = @MATKHAU WHERE MAKH = @MAKH');

    res.json({ message: 'Đặt lại mật khẩu thành công!' });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
};

module.exports = { forgotPassword, resetPassword };
