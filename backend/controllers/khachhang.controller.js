const khachhangModel = require('../models/khachhang.model');

// GET thông tin khách hàng
const getKhachHangById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 MAKH cần lấy:', id);

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    // Gọi hàm model lấy dữ liệu (nhận về nguyên kết quả query)
    const result = await khachhangModel.fetchKhachHangById(id);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('❌ Lỗi SQL:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin khách hàng', error: error.message });
  }
};

// PUT cập nhật thông tin khách hàng
const updateKhachHang = async (req, res) => {
  try {
    const { id } = req.params;
    const { TEN, DCHI, DTHOAI, EMAIL } = req.body;

    // Gọi hàm model cập nhật
    await khachhangModel.updateKhachHangInfo(id, { TEN, DCHI, DTHOAI, EMAIL });

    res.json({ message: 'Cập nhật thành công!' });
  } catch (error) {
    console.error('❌ Lỗi cập nhật:', error);
    res.status(500).json({ message: 'Cập nhật thất bại!', error: error.message });
  }
};

module.exports = {
  getKhachHangById,
  updateKhachHang,
};
