import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState({
    TEN: '',
    MOTA: '',
    GIATIEN: '',
    MALOAI: '',
    THOIGIANTHUCHIEN: '',
  });
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/services/${id}`);
        setService({
          ...res.data,
          MALOAI: res.data.MALOAI?.toString() || '', // Ép MALOAI thành string
        });
      } catch (err) {
        console.error('Lỗi lấy dịch vụ:', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services/categories');
        console.log('Categories lấy được:', res.data); // thêm log này
    
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.error('Dữ liệu trả về không phải mảng:', res.data);
        }
      } catch (err) {
        console.error('Lỗi lấy loại dịch vụ:', err);
      }
    };
    

    fetchService();
    fetchCategories();
  }, [id]);

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('TEN', service.TEN);
      formData.append('MOTA', service.MOTA);
      formData.append('GIATIEN', service.GIATIEN);
      formData.append('MALOAI', parseInt(service.MALOAI)); // ép về số để server nhận sql.Int
      formData.append('THOIGIANTHUCHIEN', service.THOIGIANTHUCHIEN);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      await axios.put(`http://localhost:5000/api/services/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Cập nhật thành công!');
      navigate('/admin/services');
    } catch (error) {
      console.error('Cập nhật lỗi:', error);
      alert('Cập nhật thất bại!');
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Chỉnh sửa Dịch Vụ</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên Dịch Vụ</label>
          <input
            type="text"
            className="form-control"
            name="TEN"
            value={service.TEN}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Mô Tả</label>
          <textarea
            className="form-control"
            name="MOTA"
            value={service.MOTA}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Giá Tiền</label>
          <input
            type="number"
            className="form-control"
            name="GIATIEN"
            value={service.GIATIEN}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Loại Dịch Vụ</label>
          <select
            className="form-control"
            name="MALOAI"
            value={service.MALOAI}
            onChange={handleChange}
          >
            <option value="">-- Chọn loại dịch vụ --</option>
            {categories.map((cat) => (
              <option key={cat.MALOAI} value={cat.MALOAI.toString()}>
                {cat.TENLOAI}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Thời Gian Thực Hiện (phút)</label>
          <input
            type="number"
            className="form-control"
            name="THOIGIANTHUCHIEN"
            value={service.THOIGIANTHUCHIEN}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Hình Ảnh (nếu muốn đổi)</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="btn btn-success w-100 mt-4">
          Cập Nhật Dịch Vụ
        </button>
      </form>
    </div>
  );
};

export default EditService;
