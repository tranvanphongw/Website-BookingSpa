const sql = require('mssql');

class Employee {
  // Get all employees
  static async getAll() {
    try {
      const pool = await sql.connect(process.env.DB_CONNECTION);
      const result = await pool.request().query('SELECT * FROM NHANVIEN');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  // Get employee by ID
  static async getById(id) {
    try {
      const pool = await sql.connect(process.env.DB_CONNECTION);
      const result = await pool.request()
        .input('MANV', sql.Int, id)
        .query('SELECT * FROM NHANVIEN WHERE MANV = @MANV');
      
      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }

  // Create new employee
  static async create(employeeData) {
    try {
      const { TEN, DCHI, DTHOAI, CHUYENMON, DIEMDANHGIA, HINHANH } = employeeData;
      const pool = await sql.connect(process.env.DB_CONNECTION);
      const result = await pool.request()
        .input('TEN', sql.NVarChar, TEN)
        .input('DCHI', sql.NVarChar, DCHI)
        .input('DTHOAI', sql.VarChar, DTHOAI)
        .input('CHUYENMON', sql.NVarChar, CHUYENMON)
        .input('DIEMDANHGIA', sql.Float, DIEMDANHGIA)
        .input('HINHANH', sql.NVarChar, HINHANH)
        .query('INSERT INTO NHANVIEN (TEN, DCHI, DTHOAI, CHUYENMON, DIEMDANHGIA, HINHANH) VALUES (@TEN, @DCHI, @DTHOAI, @CHUYENMON, @DIEMDANHGIA, @HINHANH)');
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Update an employee
  static async update(id, employeeData) {
    try {
      const { TEN, DCHI, DTHOAI, CHUYENMON, DIEMDANHGIA, HINHANH } = employeeData;
      const pool = await sql.connect(process.env.DB_CONNECTION);
      const result = await pool.request()
        .input('MANV', sql.Int, id)
        .input('TEN', sql.NVarChar, TEN)
        .input('DCHI', sql.NVarChar, DCHI)
        .input('DTHOAI', sql.VarChar, DTHOAI)
        .input('CHUYENMON', sql.NVarChar, CHUYENMON)
        .input('DIEMDANHGIA', sql.Float, DIEMDANHGIA)
        .input('HINHANH', sql.NVarChar, HINHANH)
        .query('UPDATE NHANVIEN SET TEN = @TEN, DCHI = @DCHI, DTHOAI = @DTHOAI, CHUYENMON = @CHUYENMON, DIEMDANHGIA = @DIEMDANHGIA, HINHANH = @HINHANH WHERE MANV = @MANV');
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Delete an employee
  static async delete(id) {
    try {
      const pool = await sql.connect(process.env.DB_CONNECTION);
      const result = await pool.request()
        .input('MANV', sql.Int, id)
        .query('DELETE FROM NHANVIEN WHERE MANV = @MANV');
      
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Employee;