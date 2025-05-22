import React, { useState } from 'react';
import axios from 'axios';
import styles from './Register.module.css'; // Import CSS Module
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); // Khởi tạo useNavigate để điều hướng trang

  const handleRegister = async () => {
    if (!name || !email || !password || !address || !phone) {
      setMessage("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        EMAIL: email,
        MATKHAU: password,
        TEN: name,
        DCHI: address,
        DTHOAI: phone,
      });

      setMessage("Đăng ký thành công!");
      // Sau khi đăng ký thành công, chuyển đến trang đăng nhập
      setTimeout(() => navigate('/login'), 2000); // 2 giây sau khi thông báo đăng ký thành công, chuyển đến trang đăng nhập
      console.log(response.data);
    } catch (err) {
      if (err.response && err.response.data) {
        setMessage(err.response.data.message); // Hiển thị thông báo lỗi từ backend
      } else {
        setMessage('Đăng ký thất bại!');
      }
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Đăng Ký</h1>
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Tên đầy đủ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.inputField} // Sử dụng class từ CSS module
        />
      </div>
      <div className={styles.formGroup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputField} // Sử dụng class từ CSS module
        />
      </div>
      <div className={styles.formGroup}>
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputField} // Sử dụng class từ CSS module
        />
      </div>
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={styles.inputField} // Sử dụng class từ CSS module
        />
      </div>
      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={styles.inputField} // Sử dụng class từ CSS module
        />
      </div>
      <button onClick={handleRegister} className={styles.button}>Đăng ký</button>
      {message && <div className={`${styles.message} ${message === 'Đăng ký thành công!' ? 'success' : 'error'}`}>{message}</div>} {/* Hiển thị thông báo */}
    </div>
  );
};

export default Register;
