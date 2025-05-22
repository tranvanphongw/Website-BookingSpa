const sql = require('mssql');
const { poolPromise } = require('../config/db');

async function getAllRatings() {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM DANHGIA');
  return result.recordset;
}

async function addOrUpdateRating({ MAKH, MANV, SOSAO, BINHLUAN }) {
  const pool = await poolPromise;

  // Kiểm tra tồn tại
  const checkResult = await pool.request()
    .input('MAKH', sql.Int, MAKH)
    .input('MANV', sql.Int, MANV)
    .query('SELECT * FROM DANHGIA WHERE MAKH = @MAKH AND MANV = @MANV');

  if (checkResult.recordset.length > 0) {
    // Cập nhật
    await pool.request()
      .input('MAKH', sql.Int, MAKH)
      .input('MANV', sql.Int, MANV)
      .input('SOSAO', sql.Float, SOSAO)
      .input('BINHLUAN', sql.NVarChar, BINHLUAN)
      .query(`
        UPDATE DANHGIA 
        SET SOSAO = @SOSAO, BINHLUAN = @BINHLUAN
        WHERE MAKH = @MAKH AND MANV = @MANV
      `);
  } else {
    // Thêm mới
    await pool.request()
      .input('MAKH', sql.Int, MAKH)
      .input('MANV', sql.Int, MANV)
      .input('SOSAO', sql.Float, SOSAO)
      .input('BINHLUAN', sql.NVarChar, BINHLUAN)
      .query(`
        INSERT INTO DANHGIA (MAKH, MANV, SOSAO, BINHLUAN)
        VALUES (@MAKH, @MANV, @SOSAO, @BINHLUAN)
      `);
  }

  // Cập nhật điểm trung bình trong NHANVIEN
  await pool.request()
    .input('MANV', sql.Int, MANV)
    .query(`
      UPDATE NHANVIEN
      SET DIEMDANHGIA = (
        SELECT AVG(SOSAO)
        FROM DANHGIA
        WHERE MANV = @MANV
      )
      WHERE MANV = @MANV
    `);
}

async function getRatingsByEmployee(MANV) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('MANV', sql.Int, MANV)
    .query(`
      SELECT 
        DG.*,
        KH.TEN as TENKH
      FROM DANHGIA DG
      LEFT JOIN KHACHHANG KH ON DG.MAKH = KH.MAKH
      WHERE DG.MANV = @MANV
      ORDER BY DG.SOSAO DESC
    `);
  return result.recordset;
}

async function canRate(makh, manv) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('MAKH', sql.Int, makh)
    .input('MANV', sql.Int, manv)
    .query('SELECT COUNT(*) as count FROM LICHDAT WHERE MAKH = @MAKH AND MANV = @MANV');
  return result.recordset[0].count > 0;
}

module.exports = {
  getAllRatings,
  addOrUpdateRating,
  getRatingsByEmployee,
  canRate,
};
