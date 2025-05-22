const { poolPromise, sql } = require('../config/db');

// Hàm lấy thông tin khách hàng theo id, trả về kết quả query (giữ nguyên kiểu trả về như trong controller)
const fetchKhachHangById = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', sql.Int, parseInt(id))
    .query('SELECT MAKH, TEN, DCHI, DTHOAI, EMAIL FROM KHACHHANG WHERE MAKH = @id');
  return result;
};

// Hàm cập nhật thông tin khách hàng theo id
const updateKhachHangInfo = async (id, { TEN, DCHI, DTHOAI, EMAIL }) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', sql.Int, parseInt(id))
    .input('TEN', sql.NVarChar(100), TEN)
    .input('DCHI', sql.NVarChar(200), DCHI)
    .input('DTHOAI', sql.VarChar(20), DTHOAI)
    .input('EMAIL', sql.VarChar(100), EMAIL)
    .query(`
      UPDATE KHACHHANG 
      SET TEN = @TEN, DCHI = @DCHI, DTHOAI = @DTHOAI, EMAIL = @EMAIL 
      WHERE MAKH = @id
    `);
  return result;
};

module.exports = {
  fetchKhachHangById,
  updateKhachHangInfo,
};
