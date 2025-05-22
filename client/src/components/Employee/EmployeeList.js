import React, { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import styles from './EmployeeList.module.css';

  function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      fetch('http://localhost:5000/api/employees')
        .then((res) => res.json())
        .then((data) => setEmployees(data))
        .catch((err) => console.error(err));
    }, []);

    const handleViewDetails = (empId) => {
      navigate(`/employee-ratings/${empId}`);
    };

    return (
      <div className={styles['employee-container']}>
        <h2>Danh sách nhân viên</h2>
        <div className={styles['employee-grid']}>
          {employees.map((emp) => (
            <div key={emp.MANV} className={styles['employee-card']}>
              <img src={emp.HINHANH} alt={emp.TEN} className={styles.avatar} />
              <h3>{emp.TEN}</h3>
              <p>Chuyên môn: {emp.CHUYENMON}</p>
              <p>Điểm đánh giá: {emp.DIEMDANHGIA || 'Chưa có'}</p>
              <button
                className={styles['btn-details']}
                onClick={() => handleViewDetails(emp.MANV)}
              >
                Xem chi tiết đánh giá
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  export default EmployeeList;