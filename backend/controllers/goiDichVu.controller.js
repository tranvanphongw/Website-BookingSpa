const goiDichVuModel = require('../models/goiDichVu.model');

exports.getAllGoiDichVu = async (req, res) => {
  try {
    const goiDichVu = await goiDichVuModel.getAllGoiDichVu();
    res.json(goiDichVu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi lấy danh sách gói dịch vụ' });
  }
};

exports.getChiTietGoi = async (req, res) => {
  try {
    const { MAGOI } = req.params;
    const chiTiet = await goiDichVuModel.getChiTietGoi(MAGOI);
    res.json(chiTiet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi lấy chi tiết gói' });
  }
};

exports.addGoiDichVu = async (req, res) => {
  try {
    const newGoi = await goiDichVuModel.addGoiDichVu(req.body);
    res.status(201).json(newGoi);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi thêm gói dịch vụ' });
  }
};

exports.updateGoiDichVu = async (req, res) => {
  try {
    const { id } = req.params;
    await goiDichVuModel.updateGoiDichVu(id, req.body);
    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi cập nhật gói dịch vụ' });
  }
};

exports.deleteGoiDichVu = async (req, res) => {
  try {
    const { id } = req.params;
    await goiDichVuModel.deleteGoiDichVu(id);
    res.json({ message: 'Xóa gói dịch vụ thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi xóa gói dịch vụ' });
  }
};
