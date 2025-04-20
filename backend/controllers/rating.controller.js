const sql = require('mssql');

// Lấy danh sách đánh giá
const getAllRatings = async (req, res) => {
    try {
        const pool = await sql.connect(process.env.DB_CONNECTION);
        const result = await pool.request().query('SELECT * FROM DANHGIA');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve ratings!', error });
    }
};

// Thêm đánh giá
const addRating = async (req, res) => {
    try {
        const { MAKH, MANV, SOSAO, BINHLUAN, NGAYDANHGIA } = req.body;
        const pool = await sql.connect(process.env.DB_CONNECTION);
        await pool.request()
            .input('MAKH', sql.Int, MAKH)
            .input('MANV', sql.Int, MANV)
            .input('SOSAO', sql.Int, SOSAO)
            .input('BINHLUAN', sql.NVarChar, BINHLUAN)
            .input('NGAYDANHGIA', sql.DateTime, NGAYDANHGIA)
            .query('INSERT INTO DANHGIA (MAKH, MANV, SOSAO, BINHLUAN, NGAYDANHGIA) VALUES (@MAKH, @MANV, @SOSAO, @BINHLUAN, @NGAYDANHGIA)');
        
        res.status(201).json({ message: 'Rating added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add rating!', error });
    }
};

// Cập nhật đánh giá
const updateRating = async (req, res) => {
    try {
        const { MADG, SOSAO, BINHLUAN } = req.body;
        const pool = await sql.connect(process.env.DB_CONNECTION);
        await pool.request()
            .input('MADG', sql.Int, MADG)
            .input('SOSAO', sql.Int, SOSAO)
            .input('BINHLUAN', sql.NVarChar, BINHLUAN)
            .query('UPDATE DANHGIA SET SOSAO = @SOSAO, BINHLUAN = @BINHLUAN WHERE MADG = @MADG');
        
        res.status(200).json({ message: 'Rating updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update rating!', error });
    }
};

// Xóa đánh giá
const deleteRating = async (req, res) => {
    try {
        const { MADG } = req.params;
        const pool = await sql.connect(process.env.DB_CONNECTION);
        await pool.request()
            .input('MADG', sql.Int, MADG)
            .query('DELETE FROM DANHGIA WHERE MADG = @MADG');
        
        res.status(200).json({ message: 'Rating deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete rating!', error });
    }
};

module.exports = { getAllRatings, addRating, updateRating, deleteRating };
