const sql = require('mssql');
const { poolPromise } = require('../config/db');

class Schedule {
  static async getAll() {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT LS.*, NV.TEN as TENNHANVIEN
      FROM LICHLAMVIEC LS
      JOIN NHANVIEN NV ON LS.MANV = NV.MANV
      ORDER BY LS.NGAYLAM DESC
    `);
    return result.recordset;
  }

  static async getByDate(date) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('NGAYLAM', sql.Date, date)
      .query(`
        SELECT LS.*, NV.TEN as TENNHANVIEN
        FROM LICHLAMVIEC LS
        JOIN NHANVIEN NV ON LS.MANV = NV.MANV
        WHERE CONVERT(DATE, LS.NGAYLAM) = CONVERT(DATE, @NGAYLAM)
        ORDER BY LS.THOIGIANBATDAU
      `);
    return result.recordset;
  }

  static async getByEmployeeId(employeeId) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('MANV', sql.Int, employeeId)
      .query(`
        SELECT LS.*, NV.TEN as TENNHANVIEN
        FROM LICHLAMVIEC LS
        JOIN NHANVIEN NV ON LS.MANV = NV.MANV
        WHERE LS.MANV = @MANV
        ORDER BY LS.NGAYLAM DESC
      `);
    return result.recordset;
  }

  static async create(data) {
    const pool = await poolPromise;
    
    // Validate and format time
    const formatTime = (timeStr) => {
      // Check if timeStr is in HH:mm format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(timeStr)) {
        throw new Error('Invalid time format. Use HH:mm format');
      }
      // Ensure HH:mm format with leading zeros
      const [hours, minutes] = timeStr.split(':').map(Number);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    try {
      const startTime = formatTime(data.THOIGIANBATDAU);
      const endTime = formatTime(data.THOIGIANKETTHUC);

      await pool.request()
        .input('MANV', sql.Int, data.MANV)
        .input('NGAYLAM', sql.Date, data.NGAYLAM)
        .input('THOIGIANBATDAU', sql.VarChar(5), startTime)
        .input('THOIGIANKETTHUC', sql.VarChar(5), endTime)
        .input('GHICHU', sql.NVarChar(255), data.GHICHU || null)
        .input('TRANGTHAI', sql.Int, data.TRANGTHAI)
        .query(`
          INSERT INTO LICHLAMVIEC (
            MANV, NGAYLAM, THOIGIANBATDAU, THOIGIANKETTHUC, GHICHU, TRANGTHAI
          )
          VALUES (
            @MANV, @NGAYLAM, @THOIGIANBATDAU, @THOIGIANKETTHUC, @GHICHU, @TRANGTHAI
          )
        `);
    } catch (error) {
      throw new Error(`Schedule creation failed: ${error.message}`);
    }
  }

  static async update(id, data) {
    const pool = await poolPromise;
    
    // Validate and format time
    const formatTime = (timeStr) => {
      if (!timeStr) return null;
      // Check if timeStr is in HH:mm format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(timeStr)) {
        throw new Error('Invalid time format. Use HH:mm format');
      }
      // Ensure HH:mm format with leading zeros
      const [hours, minutes] = timeStr.split(':').map(Number);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    try {
      const startTime = formatTime(data.THOIGIANBATDAU);
      const endTime = formatTime(data.THOIGIANKETTHUC);

      await pool.request()
        .input('MALICH', sql.Int, id)
        .input('MANV', sql.Int, data.MANV)
        .input('NGAYLAM', sql.Date, data.NGAYLAM)
        .input('THOIGIANBATDAU', sql.VarChar(5), startTime)
        .input('THOIGIANKETTHUC', sql.VarChar(5), endTime)
        .input('GHICHU', sql.NVarChar(255), data.GHICHU || null)
        .input('TRANGTHAI', sql.Int, data.TRANGTHAI)
        .query(`
          UPDATE LICHLAMVIEC
          SET MANV=@MANV, 
              NGAYLAM=@NGAYLAM, 
              THOIGIANBATDAU=@THOIGIANBATDAU, 
              THOIGIANKETTHUC=@THOIGIANKETTHUC, 
              GHICHU=@GHICHU, 
              TRANGTHAI=@TRANGTHAI
          WHERE MALICH=@MALICH
        `);
    } catch (error) {
      throw new Error(`Schedule update failed: ${error.message}`);
    }
  }

  static async delete(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('MALICH', sql.Int, id)
      .query('DELETE FROM LICHLAMVIEC WHERE MALICH=@MALICH');
  }
}

module.exports = Schedule;
