import React, { useEffect, useState } from 'react';
import styles from './Profile.module.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState({
    TEN: '',
    DCHI: '',
    DTHOAI: '',
    EMAIL: '',
  });

  const [isEditing, setIsEditing] = useState(false); // ✅ NEW
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const MAKH = localStorage.getItem('MAKH');
  const role = localStorage.getItem('role');

  useEffect(() => {
    if (role === 'admin') {
      navigate('/admin');
      return;
    }

    if (!MAKH) {
      console.warn('Không tìm thấy MAKH, chuyển hướng về trang đăng nhập');
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/khachhang/${MAKH}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin:', error);
        setMessage('Không thể tải thông tin khách hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [MAKH, role, navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/khachhang/${MAKH}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        setMessage('✅ Cập nhật thành công!');
        setIsEditing(false); // ✅ quay lại xem
      } else {
        setMessage('❌ Cập nhật thất bại!');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      setMessage('❌ Không thể cập nhật dữ liệu.');
    }
  };

  if (loading) return <p>Đang tải thông tin khách hàng...</p>;

  return (
    <div className={styles.profileContainer}>
      <h2>Thông tin cá nhân</h2>

      <label>Họ tên</label>
      {isEditing ? (
        <input name="TEN" value={user.TEN} onChange={handleChange} />
      ) : (
        <div>{user.TEN}</div>
      )}

      <label>Địa chỉ</label>
      {isEditing ? (
        <input name="DCHI" value={user.DCHI} onChange={handleChange} />
      ) : (
        <div>{user.DCHI}</div>
      )}

      <label>Số điện thoại</label>
      {isEditing ? (
        <input name="DTHOAI" value={user.DTHOAI} onChange={handleChange} />
      ) : (
        <div>{user.DTHOAI}</div>
      )}

      <label>Email</label>
      {isEditing ? (
        <input name="EMAIL" value={user.EMAIL} onChange={handleChange} />
      ) : (
        <div>{user.EMAIL}</div>
      )}

      {isEditing ? (
        <>
          <button onClick={handleSave}>Lưu thay đổi</button>
          <button onClick={() => setIsEditing(false)} style={{ marginLeft: '10px' }}>
            Hủy
          </button>
        </>
      ) : (
        <button onClick={() => setIsEditing(true)}>Sửa thông tin</button>
      )}

      {message && (
        <p style={{ marginTop: '10px', color: message.startsWith('✅') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Profile;
