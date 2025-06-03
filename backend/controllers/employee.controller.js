const sql = require('mssql');
const { poolPromise } = require('../config/db');

class EmployeeController {
  // Get all employees
  async getAllEmployees(req, res) {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query('SELECT * FROM NHANVIEN');
      res.json(result.recordset);
    } catch (error) {
      console.error('Error getting all employees:', error);
      res.status(500).json({ 
        message: 'Failed to retrieve employees', 
        error: error.message 
      });
    }
  }

  // Get single employee by ID
  async getEmployeeById(req, res) {
    try {
      const { id } = req.params;
      const pool = await poolPromise;
      const result = await pool.request()
        .input('MANV', sql.Int, parseInt(id))
        .query(`
          SELECT NV.*, 
          (SELECT AVG(SOSAO) FROM DANHGIA WHERE MANV = NV.MANV) AS DIEMDANHGIA_AVG
          FROM NHANVIEN NV
          WHERE NV.MANV = @MANV
        `);

      if (result.recordset.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
      }
      
      res.json(result.recordset[0]);
    } catch (error) {
      console.error('Error getting employee by ID:', error);
      res.status(500).json({ 
        message: 'Failed to retrieve employee', 
        error: error.message 
      });
    }
  }

  // Get employees who worked with a specific customer
  async getWorkedWithByCustomerId(req, res) {
    try {
      const { makh } = req.params;
      const pool = await poolPromise;
      const result = await pool.request()
        .input('MAKH', sql.Int, parseInt(makh))
        .query(`
          SELECT DISTINCT NV.*
          FROM NHANVIEN NV
          INNER JOIN LICHDAT LD ON NV.MANV = LD.MANV
          WHERE LD.MAKH = @MAKH AND LD.TRANGTHAI = 'Paid'
        `);
      
      res.json(result.recordset);
    } catch (error) {
      console.error('Error getting employees worked with customer:', error);
      res.status(500).json({ 
        message: 'Failed to retrieve employees', 
        error: error.message 
      });
    }
  }

  // Create new employee
  async createEmployee(req, res) {
    try {
      const { TEN, DCHI, DTHOAI, CHUYENMON, DIEMDANHGIA, HINHANH } = req.body;
      
      // Validate required fields
      if (!TEN || !DTHOAI) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          required: 'TEN, DTHOAI' 
        });
      }
      
      const pool = await poolPromise;
      await pool.request()
        .input('TEN', sql.NVarChar, TEN)
        .input('DCHI', sql.NVarChar, DCHI || null)
        .input('DTHOAI', sql.VarChar, DTHOAI)
        .input('CHUYENMON', sql.NVarChar, CHUYENMON || null)
        .input('DIEMDANHGIA', sql.Float, DIEMDANHGIA || 0)
        .input('HINHANH', sql.NVarChar, HINHANH || null)
        .query(`
          INSERT INTO NHANVIEN (TEN, DCHI, DTHOAI, CHUYENMON, DIEMDANHGIA, HINHANH)
          VALUES (@TEN, @DCHI, @DTHOAI, @CHUYENMON, @DIEMDANHGIA, @HINHANH)
        `);
      
      res.status(201).json({ message: 'Nhân viên đã được thêm thành công' });
    } catch (error) {
      console.error('Error creating employee:', error);
      res.status(500).json({ 
        message: 'Failed to add employee', 
        error: error.message 
      });
    }
  }

  // Update employee
  async updateEmployee(req, res) {
    try {
      const { id } = req.params;
      const { TEN, DCHI, DTHOAI, CHUYENMON, DIEMDANHGIA, HINHANH } = req.body;
      
      // Validate required fields
      if (!TEN || !DTHOAI) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          required: 'TEN, DTHOAI' 
        });
      }
      
      const pool = await poolPromise;
      const result = await pool.request()
        .input('ID', sql.Int, parseInt(id))
        .input('TEN', sql.NVarChar, TEN)
        .input('DCHI', sql.NVarChar, DCHI || null)
        .input('DTHOAI', sql.VarChar, DTHOAI)
        .input('CHUYENMON', sql.NVarChar, CHUYENMON || null)
        .input('DIEMDANHGIA', sql.Float, DIEMDANHGIA || 0)
        .input('HINHANH', sql.NVarChar, HINHANH || null)
        .query(`
          UPDATE NHANVIEN
          SET TEN = @TEN, DCHI = @DCHI, DTHOAI = @DTHOAI, 
              CHUYENMON = @CHUYENMON, DIEMDANHGIA = @DIEMDANHGIA, 
              HINHANH = @HINHANH
          WHERE MANV = @ID
        `);
      
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      
      res.json({ message: 'Nhân viên đã được cập nhật thành công' });
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ 
        message: 'Failed to update employee', 
        error: error.message 
      });
    }
  }

  // Delete employee
  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;
      
      const pool = await poolPromise;
      const result = await pool.request()
        .input('ID', sql.Int, parseInt(id))
        .query('DELETE FROM NHANVIEN WHERE MANV = @ID');
      
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      
      res.json({ message: 'Nhân viên đã được xóa thành công' });
    } catch (error) {
      console.error('Error deleting employee:', error);
      res.status(500).json({ 
        message: 'Failed to delete employee', 
        error: error.message 
      });
    }
  }

  // Test database connection
  async testConnection(req, res) {
    try {
      const pool = await poolPromise;
      const result = await pool.request().query('SELECT 1 as test');
      res.json({ 
        success: true, 
        message: 'Database connection successful',
        data: result.recordset[0] 
      });
    } catch (error) {
      console.error('Error testing connection:', error);
      res.status(500).json({ 
        success: false,
        message: 'Database connection failed',
        error: error.message 
      });
    }
  }
}

module.exports = new EmployeeController();