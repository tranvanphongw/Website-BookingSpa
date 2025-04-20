const sql = require('mssql');

// Lấy thông tin tất cả nhân viên
const getAllEmployees = async (req, res) => {
    try {
        const pool = await sql.connect(process.env.DB_CONNECTION);
        const result = await pool.request().query('SELECT * FROM NHANVIEN');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve employees!', error });
    }
};

// Lấy thông tin nhân viên theo ID
const getEmployeeById = async (req, res) => {
    try {
        const { MANV } = req.params;
        const pool = await sql.connect(process.env.DB_CONNECTION);
        const result = await pool.request()
            .input('MANV', sql.Int, MANV)
            .query('SELECT * FROM NHANVIEN WHERE MANV = @MANV');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Employee not found!' });
        }
        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve employee!', error });
    }
};

// Thêm nhân viên
const addEmployee = async (req, res) => {
    try {
        const { TEN, DCHI, DTHOAI, CHUYENMON, DIEMDANHGIA, HINHANH } = req.body;
        const pool = await sql.connect(process.env.DB_CONNECTION);
        await pool.request()
            .input('TEN', sql.NVarChar, TEN)
            .input('DCHI', sql.NVarChar, DCHI)
            .input('DTHOAI', sql.VarChar, DTHOAI)
            .input('CHUYENMON', sql.NVarChar, CHUYENMON)
            .input('DIEMDANHGIA', sql.Float, DIEMDANHGIA)
            .input('HINHANH', sql.NVarChar, HINHANH)
            .query('INSERT INTO NHANVIEN (TEN, DCHI, DTHOAI, CHUYENMON, DIEMDANHGIA, HINHANH) VALUES (@TEN, @DCHI, @DTHOAI, @CHUYENMON, @DIEMDANHGIA, @HINHANH)');
        
        res.status(201).json({ message: 'Employee added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add employee!', error });
    }
};

// Cập nhật thông tin nhân viên
const updateEmployee = async (req, res) => {
    try {
        const { MANV } = req.params;
        const { TEN, DCHI, DTHOAI, CHUYENMON, DIEMDANHGIA, HINHANH } = req.body;
        const pool = await sql.connect(process.env.DB_CONNECTION);
        await pool.request()
            .input('MANV', sql.Int, MANV)
            .input('TEN', sql.NVarChar, TEN)
            .input('DCHI', sql.NVarChar, DCHI)
            .input('DTHOAI', sql.VarChar, DTHOAI)
            .input('CHUYENMON', sql.NVarChar, CHUYENMON)
            .input('DIEMDANHGIA', sql.Float, DIEMDANHGIA)
            .input('HINHANH', sql.NVarChar, HINHANH)
            .query('UPDATE NHANVIEN SET TEN = @TEN, DCHI = @DCHI, DTHOAI = @DTHOAI, CHUYENMON = @CHUYENMON, DIEMDANHGIA = @DIEMDANHGIA, HINHANH = @HINHANH WHERE MANV = @MANV');
        
        res.status(200).json({ message: 'Employee updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update employee!', error });
    }
};

// Xóa nhân viên
const deleteEmployee = async (req, res) => {
    try {
        const { MANV } = req.params;
        const pool = await sql.connect(process.env.DB_CONNECTION);
        await pool.request()
            .input('MANV', sql.Int, MANV)
            .query('DELETE FROM NHANVIEN WHERE MANV = @MANV');
        
        res.status(200).json({ message: 'Employee deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete employee!', error });
    }
};

module.exports = { getAllEmployees, getEmployeeById, addEmployee, updateEmployee, deleteEmployee };
