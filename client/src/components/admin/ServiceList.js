import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ServiceForm.module.css'; // Đảm bảo tên file đúng và đường dẫn chính xác

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        setServices(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/services/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa dịch vụ này?')) {
      try {
        await axios.delete(`http://localhost:5000/api/services/${id}`);
        setServices(services.filter(service => service.MADV !== id));
        alert('Xóa thành công');
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Xóa thất bại');
      }
    }
  };

  const handleAddService = () => {
    navigate('/admin/services/add'); // Điều hướng đến trang thêm dịch vụ
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Danh sách Dịch Vụ</h2>

      {/* Nút "Thêm Dịch Vụ" nằm dưới tiêu đề */}
      <div className="text-left mb-4">
        <button
          className="btn btn-primary"
          onClick={handleAddService} // Thêm sự kiện khi nhấn nút
        >
          Thêm Dịch Vụ
        </button>
      </div>

      <div className="list-group">
        {services.length === 0 ? (
          <div className="alert alert-info">Không có dịch vụ nào.</div>
        ) : (
          services.map(service => (
            <div className="list-group-item d-flex justify-content-between align-items-center" key={service.MADV}>
              <div>
                <h5 className="mb-1">{service.TEN}</h5>
                <p className="mb-1">{service.MOTA}</p>
                <p className="mb-1">Giá: {service.GIATIEN} VND</p>
                {service.HINHANH && (
                  <img
                    src={`http://localhost:5000/${service.HINHANH}`}
                    alt={service.TEN}
                    style={{ width: '100px', height: 'auto', objectFit: 'cover' }}
                    className="img-thumbnail mt-2"
                  />
                )}
              </div>
              <div>
                <button
                  className="btn btn-warning btn-sm mb-2"
                  onClick={() => handleEdit(service.MADV)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(service.MADV)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServiceList;
