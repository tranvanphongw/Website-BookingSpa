const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../config/db');

// Add this route FIRST, before other routes
router.get('/worked-with/:makh', async (req, res) => {
  const { makh } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('MAKH', sql.Int, parseInt(makh))
      .query(`
        SELECT DISTINCT NV.*
        FROM NHANVIEN NV
        INNER JOIN LICHDAT LD ON NV.MANV = LD.MANV
        WHERE LD.MAKH = @MAKH 
        AND LD.TRANGTHAI = 'Paid'
      `);
    
    console.log('Query results for MAKH:', makh, result.recordset); // Debug logging
    res.json(result.recordset);
    
  } catch (err) {
    console.error('Database error:', err); // Debug log
    res.status(500).json({
      error: 'Failed to fetch employees',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Add this route for testing connection
router.get('/test-db', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT 1 as test');
    res.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    console.error('Database connection test failed:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET all employees
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise; // ✅ chờ Promise trả về pool
    const result = await pool.request().query('SELECT * FROM NHANVIEN');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add this route to get a single employee's details
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('MANV', sql.Int, parseInt(id))
      .query(`
        SELECT 
          NV.*,
          (SELECT AVG(SOSAO) FROM DANHGIA WHERE MANV = NV.MANV) as DIEMDANHGIA
        FROM NHANVIEN NV
        WHERE NV.MANV = @MANV
      `);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    
    res.json(result.recordset[0]);
    
  } catch (err) {
    console.error('Error fetching employee details:', err);
    res.status(500).json({
      error: 'Failed to fetch employee details',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// POST new employee
router.post('/', async (req, res) => {
  const { TEN, DCHI, DTHOAI, CHUYENMON, DIEMDANHGIA, HINHANH } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    await request
      .input('TEN', sql.NVarChar, TEN)
      .input('DCHI', sql.NVarChar, DCHI)
      .input('DTHOAI', sql.VarChar, DTHOAI)
      .input('CHUYENMON', sql.NVarChar, CHUYENMON)
      .input('DIEMDANHGIA', sql.Float, DIEMDANHGIA)
      .input('HINHANH', sql.NVarChar, HINHANH)
      .query('INSERT INTO NHANVIEN (TEN, DCHI, DTHOAI, CHUYENMON, DIEMDANHGIA, HINHANH) VALUES (@TEN, @DCHI, @DTHOAI, @CHUYENMON, @DIEMDANHGIA, @HINHANH)');
    res.json({ message: 'Nhân viên đã được thêm thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update employee
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { TEN, DCHI, DTHOAI, CHUYENMON, DIEMDANHGIA, HINHANH } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    await request
      .input('ID', sql.Int, id)
      .input('TEN', sql.NVarChar, TEN)
      .input('DCHI', sql.NVarChar, DCHI)
      .input('DTHOAI', sql.VarChar, DTHOAI)
      .input('CHUYENMON', sql.NVarChar, CHUYENMON)
      .input('DIEMDANHGIA', sql.Float, DIEMDANHGIA)
      .input('HINHANH', sql.NVarChar, HINHANH)
      .query('UPDATE NHANVIEN SET TEN = @TEN, DCHI = @DCHI, DTHOAI = @DTHOAI, CHUYENMON = @CHUYENMON, DIEMDANHGIA = @DIEMDANHGIA, HINHANH = @HINHANH WHERE MANV = @ID');
    res.json({ message: 'Nhân viên đã được cập nhật thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    await request
      .input('ID', sql.Int, id)
      .query('DELETE FROM NHANVIEN WHERE MANV = @ID');
    res.json({ message: 'Nhân viên đã được xóa thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;