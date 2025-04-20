const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Đăng ký người dùng
const register = async (req, res) => {
    try {
        const { TEN, DCHI, DTHOAI, EMAIL, MATKHAU, ROLE } = req.body;

        // Kiểm tra email đã tồn tại trong cơ sở dữ liệu chưa (Cả trong KHACHHANG và QUANTRIVIEN)
        const pool = await sql.connect(process.env.DB_CONNECTION);
        const resultCustomer = await pool.request()
            .input('EMAIL', sql.Varchar, EMAIL)
            .query('SELECT * FROM KHACHHANG WHERE EMAIL = @EMAIL');
        
        const resultAdmin = await pool.request()
            .input('EMAIL', sql.Varchar, EMAIL)
            .query('SELECT * FROM QUANTRIVIEN WHERE EMAIL = @EMAIL');
        
        if (resultCustomer.recordset.length > 0 || resultAdmin.recordset.length > 0) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(MATKHAU, 10);

        // Thực hiện đăng ký người dùng
        if (ROLE === 'admin') {
            // Đăng ký quản trị viên
            await pool.request()
                .input('TEN', sql.NVarChar, TEN)
                .input('DCHI', sql.NVarChar, DCHI)
                .input('DTHOAI', sql.Varchar, DTHOAI)
                .input('EMAIL', sql.Varchar, EMAIL)
                .input('MATKHAU', sql.Varchar, hashedPassword)
                .query('INSERT INTO QUANTRIVIEN (TEN, DCHI, DTHOAI, EMAIL, MATKHAU) VALUES (@TEN, @DCHI, @DTHOAI, @EMAIL, @MATKHAU)');
        } else {
            // Đăng ký khách hàng
            await pool.request()
                .input('TEN', sql.NVarChar, TEN)
                .input('DCHI', sql.NVarChar, DCHI)
                .input('DTHOAI', sql.Varchar, DTHOAI)
                .input('EMAIL', sql.Varchar, EMAIL)
                .input('MATKHAU', sql.Varchar, hashedPassword)
                .query('INSERT INTO KHACHHANG (TEN, DCHI, DTHOAI, EMAIL, MATKHAU) VALUES (@TEN, @DCHI, @DTHOAI, @EMAIL, @MATKHAU)');
        }

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Đăng ký thất bại!', error });
    }
};

// Đăng nhập người dùng
const login = async (req, res) => {
    try {
        const { EMAIL, MATKHAU } = req.body;

        // Kiểm tra người dùng có tồn tại trong bảng KHACHHANG
        const pool = await sql.connect(process.env.DB_CONNECTION);
        const resultCustomer = await pool.request()
            .input('EMAIL', sql.Varchar, EMAIL)
            .query('SELECT * FROM KHACHHANG WHERE EMAIL = @EMAIL');
        
        // Kiểm tra người dùng có tồn tại trong bảng QUANTRIVIEN
        const resultAdmin = await pool.request()
            .input('EMAIL', sql.Varchar, EMAIL)
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
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }

        // Kiểm tra mật khẩu có đúng không
        const isMatch = await bcrypt.compare(MATKHAU, user.MATKHAU);

        if (!isMatch) {
            return res.status(400).json({ message: 'Thông tin đăng nhập không hợp lệ!' });
        }

        // Tạo token và gửi về cho client
        const token = jwt.sign({ userId: user.MAKH, role: user.ROLE }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Đăng nhập thất bại!', error });
    }
};

module.exports = { register, login };
