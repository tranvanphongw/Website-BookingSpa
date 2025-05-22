const multer = require('multer');
const upload = require('../middleware/upload');
const serviceModel = require('../models/service.model');

const getAllServices = async (req, res) => {
  try {
    const { search, category } = req.query;
    const services = await serviceModel.getAllServices(search, category);
    res.json(services);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách dịch vụ:', error);
    res.status(500).json({ message: 'Không thể lấy danh sách dịch vụ', error });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await serviceModel.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách loại dịch vụ:', error);
    res.status(500).json({ message: 'Không thể lấy danh sách loại dịch vụ', error });
  }
};

const addService = async (req, res) => {
  try {
    const { TEN, MOTA, GIATIEN, MALOAI, THOIGIANTHUCHIEN } = req.body;
    const imageUrl = req.file ? `images/${req.file.filename}` : null;

    await serviceModel.addService({ TEN, MOTA, GIATIEN, MALOAI, THOIGIANTHUCHIEN, imageUrl });

    res.status(201).json({ message: 'Dịch vụ đã được thêm thành công' });
  } catch (error) {
    console.error('Lỗi thêm dịch vụ:', error);
    res.status(500).json({ message: 'Lỗi thêm dịch vụ', error });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await serviceModel.getServiceById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin dịch vụ', error });
  }
};

const updateService = async (req, res) => {
  try {
    const { TEN, MOTA, GIATIEN, MALOAI, THOIGIANTHUCHIEN } = req.body;
    const imageUrl = req.file ? `images/${req.file.filename}` : null;

    await serviceModel.updateService(req.params.id, { TEN, MOTA, GIATIEN, MALOAI, THOIGIANTHUCHIEN, imageUrl });

    res.status(200).json({ message: 'Cập nhật dịch vụ thành công' });
  } catch (error) {
    console.error('Cập nhật dịch vụ thất bại:', error);
    res.status(500).json({ message: 'Cập nhật dịch vụ thất bại', error });
  }
};

const deleteService = async (req, res) => {
  try {
    await serviceModel.deleteService(req.params.id);
    res.status(200).json({ message: 'Xóa dịch vụ thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Xóa dịch vụ thất bại', error });
  }
};

module.exports = {
  getAllServices,
  getAllCategories,
  addService,
  getServiceById,
  updateService,
  deleteService
};
