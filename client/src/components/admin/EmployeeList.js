import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ServiceForm.module.css'; // Import CSS module

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    TEN: '',
    DCHI: '',
    DTHOAI: '',
    CHUYENMON: '',
    DIEMDANHGIA: '',
    HINHANH: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  // Lấy danh sách nhân viên từ API
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhân viên:', error);
    }
  };

  // Xử lý thêm hoặc cập nhật nhân viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Cập nhật nhân viên
        await axios.put(`http://localhost:5000/api/employees/${editingId}`, formData);
        setMessage('Cập nhật nhân viên thành công!');
      } else {
        // Thêm mới nhân viên
        await axios.post('http://localhost:5000/api/employees', formData);
        setMessage('Thêm nhân viên thành công!');
      }
      fetchEmployees();
      setFormData({
        TEN: '',
        DCHI: '',
        DTHOAI: '',
        CHUYENMON: '',
        DIEMDANHGIA: '',
        HINHANH: '',
      });
      setEditingId(null);
    } catch (error) {
      console.error('Lỗi khi lưu nhân viên:', error);
      setMessage('Lỗi khi lưu nhân viên!');
    }
  };

  // Xử lý xóa nhân viên
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees();
      setMessage('Xóa nhân viên thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa nhân viên:', error);
      setMessage('Lỗi khi xóa nhân viên!');
    }
  };

  // Xử lý chỉnh sửa nhân viên
  const handleEdit = (employee) => {
    setFormData(employee);
    setEditingId(employee.MANV);
  };

  return (
    <div className={styles['form-container']}>
      <h1>Quản Lý Nhân Viên</h1>

      {/* Form thêm/sửa nhân viên */}
      <form onSubmit={handleSubmit}>
        <div className={styles['form-group']}>
          <label>Tên Nhân Viên</label>
          <input
            type="text"
            value={formData.TEN}
            onChange={(e) => setFormData({ ...formData, TEN: e.target.value })}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label>Địa Chỉ</label>
          <input
            type="text"
            value={formData.DCHI}
            onChange={(e) => setFormData({ ...formData, DCHI: e.target.value })}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label>Số Điện Thoại</label>
          <input
            type="text"
            value={formData.DTHOAI}
            onChange={(e) => setFormData({ ...formData, DTHOAI: e.target.value })}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label>Chuyên Môn</label>
          <input
            type="text"
            value={formData.CHUYENMON}
            onChange={(e) => setFormData({ ...formData, CHUYENMON: e.target.value })}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label>Điểm Đánh Giá</label>
          <input
            type="number"
            value={formData.DIEMDANHGIA}
            onChange={(e) => setFormData({ ...formData, DIEMDANHGIA: e.target.value })}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label>Hình Ảnh</label>
          <input
            type="text"
            value={formData.HINHANH}
            onChange={(e) => setFormData({ ...formData, HINHANH: e.target.value })}
          />
        </div>
        <button type="submit">{editingId ? 'Cập Nhật' : 'Thêm Mới'}</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}

      {/* Danh sách nhân viên */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên</th>
            <th>Địa Chỉ</th>
            <th>Số Điện Thoại</th>
            <th>Chuyên Môn</th>
            <th>Điểm Đánh Giá</th>
            <th>Hình Ảnh</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee.MANV}>
              <td>{index + 1}</td>
              <td>{employee.TEN}</td>
              <td>{employee.DCHI}</td>
              <td>{employee.DTHOAI}</td>
              <td>{employee.CHUYENMON}</td>
              <td>{employee.DIEMDANHGIA}</td>
              <td>
                <img src={employee.HINHANH} alt="Hình ảnh" width="50" />
              </td>
              <td>
                <button onClick={() => handleEdit(employee)}>Sửa</button>
                <button onClick={() => handleDelete(employee.MANV)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeesList;