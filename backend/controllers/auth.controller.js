const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authModel = require('../models/auth.model');
const dotenv = require('dotenv');
dotenv.config();

const register = async (req, res) => {
  try {
    const { TEN, DCHI, DTHOAI, EMAIL, MATKHAU, ROLE } = req.body;

    const emailExists = await authModel.checkEmailExists(EMAIL);
    if (emailExists) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    await authModel.registerUser({ TEN, DCHI, DTHOAI, EMAIL, MATKHAU, ROLE });

    res.status(201).json({ message: 'Đăng ký thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Đăng ký thất bại!', error });
  }
};

const login = async (req, res) => {
  try {
    const { EMAIL, MATKHAU } = req.body;

    const result = await authModel.findUserByEmail(EMAIL);
    if (!result) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    const { user, type } = result;

    const isMatch = await bcrypt.compare(MATKHAU, user.MATKHAU);
    if (!isMatch) {
      return res.status(400).json({ message: 'Thông tin đăng nhập không hợp lệ!' });
    }

    // Xác định khóa ID và role theo loại user
    const userIdKey = type === 'admin' ? 'MAQT' : 'MAKH'; // MAQT giả sử cho admin, bạn kiểm tra tên đúng
    const role = type === 'admin' ? 'admin' : 'user';

   // auth.controller.js
    const token = jwt.sign(
      {
        MAKH: type === 'admin' ? user.MAQT : user.MAKH,  // ✅ Trả đúng tên trường
        TEN: user.TEN,
        role
      },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );



    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Đăng nhập thất bại!', error });
  }
};

module.exports = { register, login };
