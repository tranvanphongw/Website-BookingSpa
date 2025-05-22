const sql = require('mssql');
const { poolPromise } = require('../config/db');

class Schedule {
  // Get all schedules
  static async getAll() {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query(`
        SELECT LS.*, NV.TEN as TENNHANVIEN 
        FROM LICHLAMVIEC LS
        JOIN NHANVIEN NV ON LS.MANV = NV.MANV
        ORDER BY LS.NGAYLAM DESC
      `);
      return result.recordset;
    } catch (error) {
      console.error('Schedule getAll error:', error);
      throw error;
    }
  }

  // Get schedules for a specific employee
  static async getByEmployeeId(employeeId) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('MANV', sql.Int, parseInt(employeeId, 10))
        .query(`
          SELECT LS.*, NV.TEN as TENNHANVIEN
          FROM LICHLAMVIEC LS
          JOIN NHANVIEN NV ON LS.MANV = NV.MANV
          WHERE LS.MANV = @MANV
          ORDER BY LS.NGAYLAM DESC
        `);
      return result.recordset;
    } catch (error) {
      console.error('Schedule getByEmployeeId error:', error);
      throw error;
    }
  }

  // Get schedules for a specific date
  static async getByDate(date) {
    try {
      // Ensure the date is properly formatted for SQL Server
      const formattedDate = new Date(date).toISOString().split('T')[0];
      
      const pool = await poolPromise;
      const result = await pool.request()
        .input('NGAYLAM', sql.Date, formattedDate)
        .query(`
          SELECT LS.*, NV.TEN as TENNHANVIEN
          FROM LICHLAMVIEC LS
          JOIN NHANVIEN NV ON LS.MANV = NV.MANV
          WHERE CONVERT(DATE, LS.NGAYLAM) = CONVERT(DATE, @NGAYLAM)
          ORDER BY LS.GIOBATDAU
        `);
      return result.recordset;
    } catch (error) {
      console.error('Schedule getByDate error:', error);
      throw error;
    }
  }

  // Create new schedule
  static async create(scheduleData) {
    try {
      const { MANV, NGAYLAM, GIOBATDAU, GIOKETTHUC, GHICHU } = scheduleData;
      
      // Ensure the date is properly formatted for SQL Server
      const formattedDate = new Date(NGAYLAM).toISOString().split('T')[0];
      
      const pool = await poolPromise;
      const result = await pool.request()
        .input('MANV', sql.Int, parseInt(MANV, 10))
        .input('NGAYLAM', sql.Date, formattedDate)
        .input('GIOBATDAU', sql.VarChar(10), GIOBATDAU)
        .input('GIOKETTHUC', sql.VarChar(10), GIOKETTHUC)
        .input('GHICHU', sql.NVarChar(255), GHICHU || null)
        .query(`
          INSERT INTO LICHLAMVIEC (MANV, NGAYLAM, GIOBATDAU, GIOKETTHUC, GHICHU)
          VALUES (@MANV, @NGAYLAM, @GIOBATDAU, @GIOKETTHUC, @GHICHU);
          SELECT SCOPE_IDENTITY() AS MALICH;
        `);
      return result.recordset[0].MALICH;
    } catch (error) {
      console.error('Schedule create error:', error);
      throw error;
    }
  }

  // Update a schedule
  static async update(id, scheduleData) {
    try {
      const { MANV, NGAYLAM, GIOBATDAU, GIOKETTHUC, GHICHU } = scheduleData;
      
      const pool = await poolPromise;
      const result = await pool.request()
        .input('ID', sql.Int, parseInt(id, 10))
        .input('MANV', sql.Int, parseInt(MANV, 10))
        .input('NGAYLAM', sql.Date, new Date(NGAYLAM))
        .input('GIOBATDAU', sql.VarChar(10), GIOBATDAU)
        .input('GIOKETTHUC', sql.VarChar(10), GIOKETTHUC)
        .input('GHICHU', sql.NVarChar(255), GHICHU || null)
        .query(`
          UPDATE LICHLAMVIEC 
          SET MANV = @MANV, NGAYLAM = @NGAYLAM, GIOBATDAU = @GIOBATDAU, 
              GIOKETTHUC = @GIOKETTHUC, GHICHU = @GHICHU
          WHERE MALICH = @ID
        `);
      return result;
    } catch (error) {
      console.error('Schedule update error:', error);
      throw error;
    }
  }

  // Delete a schedule
  static async delete(id) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input('ID', sql.Int, parseInt(id, 10))
        .query('DELETE FROM LICHLAMVIEC WHERE MALICH = @ID');
      return result;
    } catch (error) {
      console.error('Schedule delete error:', error);
      throw error;
    }
  }
}

module.exports = Schedule;