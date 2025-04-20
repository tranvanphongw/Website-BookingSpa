const sql = require('mssql'); // Đảm bảo bạn import thư viện mssql đúng

const { poolPromise } = require('../config/db'); // Đảm bảo bạn import đúng

const getAllServices = async (req, res) => {
  try {
    const pool = await poolPromise; // Sử dụng poolPromise để kết nối với cơ sở dữ liệu

    const { search, category } = req.query; // Lấy tham số tìm kiếm và lọc từ query string

    // Câu truy vấn mặc định
    let query = 'SELECT * FROM DICHVU';
    let params = [];

    // Nếu có tham số tìm kiếm (search), thêm vào câu truy vấn
    if (search) {
      query += ' WHERE TEN LIKE @search';
      params.push({ name: 'search', type: sql.NVarChar, value: `%${search}%` });
    }

    // Nếu có tham số loại dịch vụ (category), thêm vào câu truy vấn
    if (category) {
      if (params.length > 0) {
        query += ' AND MALOAI = @category';
      } else {
        query += ' WHERE MALOAI = @category';
      }
      params.push({ name: 'category', type: sql.Int, value: category });
    }

    const result = await pool.request();
    params.forEach(param => {
      result.input(param.name, param.type, param.value); // Đảm bảo bạn đang sử dụng đúng kiểu dữ liệu
    });

    const queryResult = await result.query(query);

    res.json(queryResult.recordset); // Trả về danh sách dịch vụ
  } catch (error) {
    console.error('Lỗi khi lấy danh sách dịch vụ:', error);
    res.status(500).json({ message: 'Không thể lấy danh sách dịch vụ', error });
  }
};



// Các phần còn lại của mã

//lấy loại dịch vụ

const getAllCategories = async (req, res) => {
    try {
      const pool = await poolPromise; // Sử dụng poolPromise để kết nối với cơ sở dữ liệu
      const result = await pool.request().query('SELECT * FROM LOAIDICHVU');
      res.json(result.recordset); // Trả về danh sách các loại dịch vụ
    } catch (error) {
      console.error('Lỗi khi lấy danh sách loại dịch vụ:', error);
      res.status(500).json({ message: 'Không thể lấy danh sách loại dịch vụ', error });
    }
  };
  

// Thêm dịch vụ
const addService = async (req, res) => {
    try {
        const { TEN, MOTA, GIATIEN, MALOAI, THOIGIANTHUCHIEN } = req.body;

        // Kiểm tra xem MALOAI có tồn tại không
        const pool = await sql.connect(process.env.DB_CONNECTION);
        const checkLoaiDichVu = await pool.request()
            .input('MALOAI', sql.Int, MALOAI)
            .query('SELECT * FROM LOAIDICHVU WHERE MALOAI = @MALOAI');

        if (checkLoaiDichVu.recordset.length === 0) {
            return res.status(400).json({ message: 'Loại dịch vụ không hợp lệ' });
        }

        await pool.request()
            .input('TEN', sql.NVarChar, TEN)
            .input('MOTA', sql.NVarChar, MOTA)
            .input('GIATIEN', sql.Decimal, GIATIEN)
            .input('MALOAI', sql.Int, MALOAI)
            .input('THOIGIANTHUCHIEN', sql.Int, THOIGIANTHUCHIEN)
            .query('INSERT INTO DICHVU (TEN, MOTA, GIATIEN, MALOAI, THOIGIANTHUCHIEN) VALUES (@TEN, @MOTA, @GIATIEN, @MALOAI, @THOIGIANTHUCHIEN)');
        
        res.status(201).json({ message: 'Dịch vụ đã được thêm thành công' });
    } catch (error) {
        console.error('Thêm dịch vụ thất bại:', error);
        res.status(500).json({ message: 'Thêm dịch vụ thất bại', error });
    }
};

// Cập nhật dịch vụ
const updateService = async (req, res) => {
    const { id } = req.params;
    const { TEN, MOTA, GIATIEN, MALOAI, THOIGIANTHUCHIEN } = req.body;
    try {
        const pool = await sql.connect(process.env.DB_CONNECTION);
        await pool.request()
            .input('ID', sql.Int, id)
            .input('TEN', sql.NVarChar, TEN)
            .input('MOTA', sql.NVarChar, MOTA)
            .input('GIATIEN', sql.Decimal, GIATIEN)
            .input('MALOAI', sql.Int, MALOAI)
            .input('THOIGIANTHUCHIEN', sql.Int, THOIGIANTHUCHIEN)
            .query('UPDATE DICHVU SET TEN = @TEN, MOTA = @MOTA, GIATIEN = @GIATIEN, MALOAI = @MALOAI, THOIGIANTHUCHIEN = @THOIGIANTHUCHIEN WHERE MADV = @ID');
        
        res.status(200).json({ message: 'Cập nhật dịch vụ thành công' });
    } catch (error) {
        console.error('Cập nhật dịch vụ thất bại:', error);
        res.status(500).json({ message: 'Cập nhật dịch vụ thất bại', error });
    }
};

// Xóa dịch vụ
const deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(process.env.DB_CONNECTION);
        const result = await pool.request()
            .input('ID', sql.Int, id)
            .query('DELETE FROM DICHVU WHERE MADV = @ID');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Dịch vụ không tồn tại' });
        }
        
        res.status(200).json({ message: 'Xóa dịch vụ thành công' });
    } catch (error) {
        console.error('Xóa dịch vụ thất bại:', error);
        res.status(500).json({ message: 'Xóa dịch vụ thất bại', error });
    }
};

module.exports = { getAllServices, getAllCategories, addService, updateService, deleteService };
