const sql = require('mssql');
const { poolPromise } = require('../config/db');

async function getAllPayments() {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM THANHTOAN');
  return result.recordset;
}

async function addPayment(data) {
  const { MALICH, MAKH, SOTIEN, NGAYTHANHTOAN, HINHTHUCTHANHTOAN } = data;
  const pool = await poolPromise;

  const check = await pool.request()
    .input('MALICH', sql.Int, MALICH)
    .query('SELECT 1 FROM THANHTOAN WHERE MALICH = @MALICH');
  if (check.recordset.length > 0) {
    throw new Error('Booking này đã được thanh toán!');
  }

  const result = await pool.request()
    .input('MALICH', sql.Int, MALICH)
    .input('MAKH', sql.Int, MAKH)
    .input('SOTIEN', sql.Decimal(10, 2), SOTIEN)
    .input('NGAYTHANHTOAN', sql.DateTime, NGAYTHANHTOAN)
    .input('HINHTHUCTHANHTOAN', sql.NVarChar(50), HINHTHUCTHANHTOAN)
    .query(`
      INSERT INTO THANHTOAN
        (MALICH, MAKH, SOTIEN, NGAYTHANHTOAN, HINHTHUCTHANHTOAN)
      VALUES
        (@MALICH, @MAKH, @SOTIEN, @NGAYTHANHTOAN, @HINHTHUCTHANHTOAN);
      SELECT SCOPE_IDENTITY() AS MATHANHTOAN;
    `);

  const insertedId = result.recordset[0].MATHANHTOAN;

  const customerResult = await pool.request()
    .input('MAKH', sql.Int, MAKH)
    .query('SELECT TEN FROM KHACHHANG WHERE MAKH = @MAKH');

  const receipt = {
    customer: customerResult.recordset[0].TEN,
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

module.exports = { getAllPayments, addPayment, deletePayment };
