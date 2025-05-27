import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../contexts/UserContext';
import styles from './Login.module.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const { login } = useContext(UserContext);
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        EMAIL: email,
        MATKHAU: password,
      });

      const decoded = jwtDecode(response.data.token);
      console.log('✅ Token Decoded:', decoded); 
      const userRole = decoded.role;
      const MAKH = decoded.MAKH;
      const username = decoded.TEN;

      // Lưu token và thông tin vào localStorage như trước
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('MAKH', MAKH);
      localStorage.setItem('username', username);

      setMessage("Đăng nhập thành công!");

      // Gọi login của context để cập nhật user toàn cục
      login(response.data.token);

      // Điều hướng theo vai trò
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      setMessage(err.response?.data?.message || "Đăng nhập thất bại!");
      console.error('Login failed:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Đăng Nhập</h1>
      <div className={styles.formGroup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.inputField}
        />
      </div>
      <div className={styles.formGroup}>
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputField}
        />
      </div>
      <button onClick={handleLogin} className={styles.button}>Đăng nhập</button>
      {message && <div className={styles.message}>{message}</div>}

      <div
        style={{
          marginTop: '1rem',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          gap: '1.5rem',
          fontSize: '0.9rem'
        }}
      >
        <span>
          Chưa có tài khoản?{' '}
          <span
            style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => navigate('/register')}
          >
            Đăng ký ngay
          </span>
        </span>
        <span
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate('/forgot-password')}
        >
          Quên mật khẩu?
        </span>
      </div>
    </div>
  );
};

export default Login;
