const Employee = require('../models/employee.model');

// Lấy thông tin tất cả nhân viên
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.getAll();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve employees!', error });
  }
};

// Lấy thông tin nhân viên theo ID
const getEmployeeById = async (req, res) => {
  try {
    const { MANV } = req.params;
    const employee = await Employee.getById(MANV);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found!' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve employee!', error });
  }
};

// Thêm nhân viên
const addEmployee = async (req, res) => {
  try {
    await Employee.create(req.body);
    res.status(201).json({ message: 'Employee added successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add employee!', error });
  }
};

// Cập nhật thông tin nhân viên
const updateEmployee = async (req, res) => {
  try {
    const { MANV } = req.params;
    await Employee.update(MANV, req.body);
    res.status(200).json({ message: 'Employee updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update employee!', error });
  }
};

// Xóa nhân viên
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.delete(id);
    res.status(200).json({ message: 'Nhân viên đã được xóa thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa nhân viên!', error });
  }
};

module.exports = { getAllEmployees, getEmployeeById, addEmployee, updateEmployee, deleteEmployee };