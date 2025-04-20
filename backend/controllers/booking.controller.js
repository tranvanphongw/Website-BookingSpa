const sql = require('mssql');

// Đặt lịch
const createBooking = async (req, res) => {
    try {
        const { MAKH, MANV, MADV, THOIGIANBATDAU, THOIGIANKETTHUC, TRANGTHAI } = req.body;
        const pool = await sql.connect(process.env.DB_CONNECTION);
        await pool.request()
            .input('MAKH', sql.Int, MAKH)
            .input('MANV', sql.Int, MANV)
            .input('MADV', sql.Int, MADV)
            .input('THOIGIANBATDAU', sql.DateTime, THOIGIANBATDAU)
            .input('THOIGIANKETTHUC', sql.DateTime, THOIGIANKETTHUC)
            .input('TRANGTHAI', sql.NVarChar, TRANGTHAI)
            .query('INSERT INTO LICHDAT (MAKH, MANV, MADV, THOIGIANBATDAU, THOIGIANKETTHUC, TRANGTHAI) VALUES (@MAKH, @MANV, @MADV, @THOIGIANBATDAU, @THOIGIANKETTHUC, @TRANGTHAI)');
        
        res.status(201).json({ message: 'Booking created successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create booking!', error });
    }
};

// Cập nhật lịch đặt
const updateBooking = async (req, res) => {
    try {
        const { MALICH, TRANGTHAI } = req.body;
        const pool = await sql.connect(process.env.DB_CONNECTION);
        await pool.request()
            .input('MALICH', sql.Int, MALICH)
            .input('TRANGTHAI', sql.NVarChar, TRANGTHAI)
            .query('UPDATE LICHDAT SET TRANGTHAI = @TRANGTHAI WHERE MALICH = @MALICH');
        
        res.status(200).json({ message: 'Booking updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update booking!', error });
    }
};

// Hủy lịch đặt
const cancelBooking = async (req, res) => {
    try {
        const { MALICH } = req.params;
        const pool = await sql.connect(process.env.DB_CONNECTION);
        await pool.request()
            .input('MALICH', sql.Int, MALICH)
            .query('DELETE FROM LICHDAT WHERE MALICH = @MALICH');
        
        res.status(200).json({ message: 'Booking canceled successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to cancel booking!', error });
    }
};

module.exports = { createBooking, updateBooking, cancelBooking };
