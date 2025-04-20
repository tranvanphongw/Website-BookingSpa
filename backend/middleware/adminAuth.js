const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    // Lấy token từ header Authorization (Bearer token)
    const token = req.header('Authorization')?.split(' ')[1];

    // Nếu không có token, trả về lỗi
    if (!token) {
        return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    try {
        // Giải mã token để lấy thông tin người dùng
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Kiểm tra role trong token, nếu không phải admin thì trả về lỗi
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không có quyền admin' });
        }

        // Lưu thông tin người dùng vào request để có thể sử dụng ở các route sau
        req.user = decoded;

        // Tiếp tục xử lý request
        next();

    } catch (err) {
        // Nếu token không hợp lệ, trả về lỗi
        return res.status(403).json({ message: 'Token không hợp lệ' });
    }
};

module.exports = adminAuth;
