import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ServiceForm.module.css';

const AddService = () => {
  const [service, setService] = useState({
    TEN: '',
    MOTA: '',
    GIATIEN: 0,
    MALOAI: 0,
    THOIGIANTHUCHIEN: 0,
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách loại dịch vụ:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
  };

  const handleImageChange = (e) => {
    setService({ ...service, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!service.TEN || !service.MOTA || !service.GIATIEN || !service.MALOAI || !service.THOIGIANTHUCHIEN || !service.image) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('TEN', service.TEN);
    formData.append('MOTA', service.MOTA);
    formData.append('GIATIEN', service.GIATIEN);
    formData.append('MALOAI', service.MALOAI);
    formData.append('THOIGIANTHUCHIEN', service.THOIGIANTHUCHIEN);
    formData.append('image', service.image);


    try {
      await axios.post('http://localhost:5000/api/services', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Dịch vụ đã được thêm thành công');
      navigate('/services');
    } catch (error) {
      console.error('Lỗi khi thêm dịch vụ:', error);
      alert('Thêm dịch vụ thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.addService}>
      <h1>Thêm Dịch Vụ Mới</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <input
            type="text"
            name="TEN"
            placeholder="Tên dịch vụ"
            value={service.TEN}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <textarea
            name="MOTA"
            placeholder="Mô tả"
            value={service.MOTA}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="number"
            name="GIATIEN"
            placeholder="Giá tiền"
            value={service.GIATIEN || ''}  // Giá trị mặc định là rỗng thay vì 0
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <select
            name="MALOAI"
            value={service.MALOAI}
            onChange={handleChange}
            className={styles.input}
            required
          >
            <option value="">Chọn loại dịch vụ</option>
            {categories.map((category) => (
              <option key={category.MALOAI} value={category.MALOAI}>
                {category.TENLOAI}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <input
            type="number"
            name="THOIGIANTHUCHIEN"
            placeholder="Thời gian thực hiện"
            value={service.THOIGIANTHUCHIEN || ''}  // Giá trị mặc định là rỗng thay vì 0
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className={styles.input}
            accept="image/*"
            required
          />
        </div>
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Đang thêm dịch vụ...' : 'Thêm Dịch Vụ'}
        </button>
      </form>
    </div>
  );
};

export default AddService;
