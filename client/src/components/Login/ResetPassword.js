import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get('token');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!newPassword) {
      setMessage('Vui lòng nhập mật khẩu mới.');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (!token) {
      setMessage('Token không hợp lệ hoặc không tồn tại.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        token,
        newPassword
      });
      setMessage(res.data.message);

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Lỗi khi đặt lại mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Đặt lại mật khẩu</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Mật khẩu mới"
          className={styles.inputField}
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            if (message) setMessage('');
          }}
          disabled={loading}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Xác nhận'}
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
