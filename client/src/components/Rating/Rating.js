import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Rating.module.css';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const Rating = () => {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');
  // Thêm state cho username và password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Lấy MAKH từ localStorage
  const MAKH = localStorage.getItem('MAKH');

  // Đảm bảo luôn có MAKH trong localStorage nếu đã có token
  useEffect(() => {
    const token = localStorage.getItem('token');
    const makh = localStorage.getItem('MAKH');
    if (token && !makh) {
      const payload = parseJwt(token);
      if (payload && payload.MAKH) {
        localStorage.setItem('MAKH', payload.MAKH);
        window.location.reload(); // reload để cập nhật giao diện
      }
    }
  }, []);

  useEffect(() => {
    if (!MAKH) {
      setMessage('Bạn chưa đăng nhập!');
      return;
    }
    
    // Add debug logging
    console.log('Fetching employees for MAKH:', MAKH);
    
    axios.get(`http://localhost:5000/api/employees/worked-with/${MAKH}`)
      .then(res => {
        console.log('API response:', res.data); // Debug logging
        if (Array.isArray(res.data)) {
          setEmployees(res.data);
          if (res.data.length === 0) {
            setMessage('Bạn chưa từng làm việc với nhân viên nào.');
          }
        } else {
          setMessage('Dữ liệu không hợp lệ.');
        }
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
        setMessage(error.response?.data?.error || 'Không lấy được danh sách nhân viên!');
      });
  }, [MAKH]);

  // Hàm đăng nhập
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);

      const payload = parseJwt(token);
      if (payload && payload.MAKH) {
        localStorage.setItem('MAKH', payload.MAKH);
      }
      window.location.reload(); // reload để cập nhật giao diện
    } catch (err) {
      setMessage('Đăng nhập thất bại!');
    }
  };

  const handleOpenRating = (emp) => {
    setSelectedEmployee(emp);
    setShowRatingModal(true);
    setRating(5);
    setComment('');
  };

  const handleSubmitRating = async () => {
    try {
      await axios.post('http://localhost:5000/api/ratings/add', {
        MAKH: MAKH,
        MANV: selectedEmployee.MANV,
        SOSAO: rating,
        BINHLUAN: comment
      });
      setMessage('Đánh giá thành công!');
      setShowRatingModal(false);
      // Reload employee list to get updated ratings
      window.location.reload();
    } catch (error) {
      setMessage('Không thể gửi đánh giá. Vui lòng thử lại!');
    }
  };

  // Nếu chưa đăng nhập thì hiện form đăng nhập
  if (!MAKH) {
    return (
      <div className={styles.container}>
        <h2>Đăng nhập</h2>
        <input
          className={styles.inputField}
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className={styles.inputField}
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className={styles.button} onClick={handleLogin}>Đăng nhập</button>
        {message && <div className={styles.message}>{message}</div>}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Nhân viên đã làm việc với bạn</h2>
      {message && <div className={styles.message}>{message}</div>}
      <div className={styles.employeeList}> 
        {employees.map(emp => (
          <div 
            key={emp.MANV} 
            className={styles.employeeCard}
            onClick={() => handleOpenRating(emp)}
          >
            <img src={emp.HINHANH} alt={emp.TEN} className={styles.avatar} />
            <div>{emp.TEN}</div>
            <div>Chuyên môn: {emp.CHUYENMON}</div>
            <div>Điểm đánh giá: {emp.DIEMDANHGIA || 'Chưa có'}</div>
          </div>
        ))}
      </div>

      {showRatingModal && selectedEmployee && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Đánh giá nhân viên: {selectedEmployee.TEN}</h3>
            <div className={styles.ratingForm}>
              <div className={styles.ratingField}>
                <label>Số sao:</label>
                <select 
                  value={rating} 
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value="1">1 sao</option>
                  <option value="2">2 sao</option>
                  <option value="3">3 sao</option>
                  <option value="4">4 sao</option>
                  <option value="5">5 sao</option>
                </select>
              </div>
              <div className={styles.ratingField}>
                <label>Nhận xét:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Nhập nhận xét của bạn..."
                />
              </div>
              <div className={styles.modalButtons}>
                <button onClick={() => setShowRatingModal(false)}>Hủy</button>
                <button onClick={handleSubmitRating}>Gửi đánh giá</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rating;