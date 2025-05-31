const sql = require('mssql');
const { poolPromise } = require('../config/db');

async function getAllPayments() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query(`
      SELECT t.*, k.TEN AS TENKH
      FROM THANHTOAN t
      LEFT JOIN KHACHHANG k ON t.MAKH = k.MAKH
      ORDER BY t.NGAYTHANHTOAN DESC
    `);
  return result.recordset;
}
async function addPayment(data) {
  const { MALICH, MAKH, SOTIEN, NGAYTHANHTOAN, HINHTHUCTHANHTOAN } = data;
  const pool = await poolPromise;

  // Kiểm tra xem booking này đã thanh toán chưa
  const check = await pool.request()
    .input('MALICH', sql.Int, MALICH)
    .query('SELECT 1 FROM THANHTOAN WHERE MALICH = @MALICH');
  if (check.recordset.length > 0) {
    throw new Error('Booking này đã được thanh toán!');
  }

  // Thêm bản ghi thanh toán mới
  const result = await pool.request()
    .input('MALICH', sql.Int, MALICH)
    .input('MAKH', sql.Int, MAKH)
    .input('SOTIEN', sql.Decimal(18, 2), SOTIEN) // Tăng độ rộng decimal nếu cần
    .input('NGAYTHANHTOAN', sql.DateTime, NGAYTHANHTOAN)
    .input('HINHTHUCTHANHTOAN', sql.NVarChar(50), HINHTHUCTHANHTOAN)
    .query(`
      INSERT INTO THANHTOAN (MALICH, MAKH, SOTIEN, NGAYTHANHTOAN, HINHTHUCTHANHTOAN)
      VALUES (@MALICH, @MAKH, @SOTIEN, @NGAYTHANHTOAN, @HINHTHUCTHANHTOAN);
      SELECT SCOPE_IDENTITY() AS MATHANHTOAN;
    `);

  const insertedId = result.recordset[0].MATHANHTOAN;

  // Lấy tên khách hàng theo MAKH (nếu có)
  const customerResult = await pool.request()
    .input('MAKH', sql.Int, MAKH)
    .query('SELECT TEN FROM KHACHHANG WHERE MAKH = @MAKH');

  const receipt = {
    customer: customerResult.recordset[0]?.TEN || 'Khách hàng không xác định',
    totalAmount: SOTIEN,
    paymentMethod: HINHTHUCTHANHTOAN,
    paymentDate: new Date(NGAYTHANHTOAN).toLocaleString()
  };

  return { insertedId, receipt };
}

async function deletePayment(MATHANHTOAN) {
  const pool = await poolPromise;
  await pool.request()
    .input('MATHANHTOAN', sql.Int, MATHANHTOAN)
    .query('DELETE FROM THANHTOAN WHERE MATHANHTOAN = @MATHANHTOAN');
}

async function getPaymentsByCustomer(MAKH) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('MAKH', sql.Int, MAKH)
    .query(`
      SELECT t.*, k.TEN AS TENKH
      FROM THANHTOAN t
      LEFT JOIN KHACHHANG k ON t.MAKH = k.MAKH
      WHERE t.MAKH = @MAKH
      ORDER BY t.NGAYTHANHTOAN DESC
    `);
  return result.recordset;
}

async function getPaymentsByBooking(MALICH) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('MALICH', sql.Int, MALICH)
    .query(`
      SELECT t.*, k.TEN AS TENKH
      FROM THANHTOAN t
      LEFT JOIN KHACHHANG k ON t.MAKH = k.MAKH
      WHERE t.MALICH = @MALICH
      ORDER BY t.NGAYTHANHTOAN DESC
    `);
  return result.recordset;
}



module.exports = {
  getAllPayments,
  addPayment,
  deletePayment,
  getPaymentsByCustomer,
  getPaymentsByBooking
};
