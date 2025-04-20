const sql = require('mssql');

// Lấy danh sách thanh toán
const getAllPayments = async (req, res) => {
    try {
        const pool = await sql.connect(process.env.DB_CONNECTION);
        const result = await pool.request().query('SELECT * FROM THANHTOAN');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve payments!', error });
    }
};

// Thêm thanh toán
const addPayment = async (req, res) => {
    try {
        const { MALICH, MAKH, SOTIEN, NGAYTHANHTOAN, HINHTHUCTHANHTOAN } = req.body;
        const pool = await sql.connect(process.env.DB_CONNECTION);
        await pool.request()
            .input('MALICH', sql.Int, MALICH)
            .input('MAKH', sql.Int, MAKH)
            .input('SOTIEN', sql.Decimal, SOTIEN)
            .input('NGAYTHANHTOAN', sql.DateTime, NGAYTHANHTOAN)
            .input('HINHTHUCTHANHTOAN', sql.NVarChar, HINHTHUCTHANHTOAN)
            .query('INSERT INTO THANHTOAN (MALICH, MAKH, SOTIEN, NGAYTHANHTOAN, HINHTHUCTHANHTOAN) VALUES (@MALICH, @MAKH, @SOTIEN, @NGAYTHANHTOAN, @HINHTHUCTHANHTOAN)');
        
        res.status(201).json({ message: 'Payment added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add payment!', error });
    }
};

// Cập nhật thanh toán
const updatePayment = async (req, res) => {
    try {
        const { MATHANHTOAN, SOTIEN, NGAYTHANHTOAN, HINHTHUCTHANHTOAN } = req.body;
        const pool = await sql.connect(process.env.DB_CONNECTION);
        await pool.request()
            .input('MATHANHTOAN', sql.Int, MATHANHTOAN)
            .input('SOTIEN', sql.Decimal, SOTIEN)
            .input('NGAYTHANHTOAN', sql.DateTime, NGAYTHANHTOAN)
            .input('HINHTHUCTHANHTOAN', sql.NVarChar, HINHTHUCTHANHTOAN)
            .query('UPDATE THANHTOAN SET SOTIEN = @SOTIEN, NGAYTHANHTOAN = @NGAYTHANHTOAN, HINHTHUCTHANHTOAN = @HINHTHUCTHANHTOAN WHERE MATHANHTOAN = @MATHANHTOAN');
        
        res.status(200).json({ message: 'Payment updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update payment!', error });
    }
};

// Xóa thanh toán
const deletePayment = async (req, res) => {
    try {
        const { MATHANHTOAN } = req.params;
        const pool = await sql.connect(process.env.DB_CONNECTION);
        await pool.request()
            .input('MATHANHTOAN', sql.Int, MATHANHTOAN)
            .query('DELETE FROM THANHTOAN WHERE MATHANHTOAN = @MATHANHTOAN');
        
        res.status(200).json({ message: 'Payment deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete payment!', error });
    }
};

module.exports = { getAllPayments, addPayment, updatePayment, deletePayment };
