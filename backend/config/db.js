const sql = require('mssql');
const dotenv = require('dotenv');

// Tải cấu hình từ file .env
dotenv.config();

const config = {
  user: process.env.DB_USER, // Thông tin tài khoản user
  password: process.env.DB_PASS, // Thông tin mật khẩu
  server: process.env.DB_HOST,  // Máy chủ, ví dụ: 'localhost' hoặc 'PHONG\SQLEXPRESS'
  database: process.env.DB_NAME, // Tên cơ sở dữ liệu
  port: parseInt(process.env.DB_PORT), // Cổng kết nối, ví dụ: 1433
  options: {
    trustServerCertificate: true, // Cho phép sử dụng chứng chỉ máy chủ (không sử dụng SSL)
    encrypt: false, // Nếu không sử dụng SSL, để true nếu bạn sử dụng SSL
  },
};

// Kết nối tới SQL Server
const poolPromise = new sql.ConnectionPool(config)
  .connect()  // Tạo kết nối
  .then((pool) => {
    console.log("Kết nối cơ sở dữ liệu thành công.");
    return pool;
  })
  .catch((err) => {
    console.error("Lỗi kết nối tới cơ sở dữ liệu:", err);
    throw err; // Ném lỗi nếu kết nối thất bại
  });

module.exports = { sql, poolPromise };
