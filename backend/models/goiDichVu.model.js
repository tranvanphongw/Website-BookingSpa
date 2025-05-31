const sql = require('mssql');
const { poolPromise } = require('../config/db');

// Lấy danh sách tất cả gói dịch vụ
async function getAllGoiDichVu() {
  const pool = await poolPromise;
  const result = await pool.request()
    .query('SELECT MAGOI, TEN, MOTA, GIATIEN, MALOAI FROM GOIDICHVU');
  return result.recordset;
}

// Lấy chi tiết gói dịch vụ (dịch vụ trong gói)
async function getChiTietGoi(MAGOI) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('MAGOI', sql.Int, MAGOI)
    .query('SELECT MADV FROM GOI_CHITIET WHERE MAGOI = @MAGOI');
  return result.recordset;
}

// Thêm gói dịch vụ mới
async function addGoiDichVu({ TEN, MOTA, GIATIEN, MALOAI }) {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('TEN', sql.NVarChar(255), TEN)
    .input('MOTA', sql.NVarChar(sql.MAX), MOTA)
    .input('GIATIEN', sql.Decimal(18, 2), GIATIEN)
    .input('MALOAI', sql.Int, MALOAI)
    .query(`
      INSERT INTO GOIDICHVU (TEN, MOTA, GIATIEN, MALOAI)
      VALUES (@TEN, @MOTA, @GIATIEN, @MALOAI);
      SELECT SCOPE_IDENTITY() AS MAGOI;
    `);
  return result.recordset[0];
}

// Cập nhật gói dịch vụ
async function updateGoiDichVu(MAGOI, { TEN, MOTA, GIATIEN, MALOAI }) {
  const pool = await poolPromise;
  await pool.request()
    .input('MAGOI', sql.Int, MAGOI)
    .input('TEN', sql.NVarChar(255), TEN)
    .input('MOTA', sql.NVarChar(sql.MAX), MOTA)
    .input('GIATIEN', sql.Decimal(18, 2), GIATIEN)
    .input('MALOAI', sql.Int, MALOAI)
    .query(`
      UPDATE GOIDICHVU
      SET TEN = @TEN, MOTA = @MOTA, GIATIEN = @GIATIEN, MALOAI = @MALOAI
      WHERE MAGOI = @MAGOI
    `);
}

// Xóa gói dịch vụ
async function deleteGoiDichVu(MAGOI) {
  const pool = await poolPromise;
  await pool.request()
    .input('MAGOI', sql.Int, MAGOI)
    .query('DELETE FROM GOIDICHVU WHERE MAGOI = @MAGOI');
}

module.exports = {
  getAllGoiDichVu,
  getChiTietGoi,
  addGoiDichVu,
  updateGoiDichVu,
  deleteGoiDichVu,
};
