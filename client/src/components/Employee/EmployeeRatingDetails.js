import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './EmployeeRatingDetails.module.css';

function EmployeeRatingDetails() {
  const { empId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const [empResponse, ratingsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/employees/${empId}`),
          axios.get(`http://localhost:5000/api/ratings/employee/${empId}`)
        ]);

        setEmployee(empResponse.data);
        setRatings(ratingsResponse.data);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [empId]);

  const renderStarRating = (rating) => {
    // Convert to number and handle null/undefined
    let numRating = Number(rating);
    
    // Check if it's a valid number
    if (isNaN(numRating)) {
      return <div className={styles.starRating}>Chưa có đánh giá</div>;
    }

    // Round to nearest whole number
    numRating = Math.round(numRating);
    
    // Ensure rating is between 1 and 5
    numRating = Math.max(1, Math.min(5, numRating));
    
    return (
      <div className={styles.starRating}>
        {'⭐'.repeat(numRating)}
        <span className={styles.ratingNumber}>({numRating})</span>
      </div>
    );
  };

  const calculateAverageRating = () => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, curr) => acc + Number(curr.SOSAO), 0);
    return sum / ratings.length;
  };

  if (loading) return <div>Đang tải...</div>;
  if (!employee) return <div>Không tìm thấy nhân viên</div>;

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ← Quay lại
      </button>
      
      <div className={styles.employeeInfo}>
        <img src={employee.HINHANH} alt={employee.TEN} className={styles.avatar} />
        <h2>{employee.TEN}</h2>
        <p>Chuyên môn: {employee.CHUYENMON}</p>
        <div className={styles.averageRating}>
          <h3>Điểm đánh giá trung bình:</h3>
          {ratings.length > 0 ? (
            renderStarRating(calculateAverageRating())
          ) : (
            <p>Chưa có đánh giá</p>
          )}
          <p className={styles.totalRatings}>
            (Tổng số: {ratings.length} đánh giá)
          </p>
        </div>
      </div>

      <div className={styles.ratingsContainer}>
        <h3>Chi tiết đánh giá</h3>
        {ratings.length > 0 ? (
          ratings.map((rating, index) => (
            <div 
              // Add index to make key unique even if same customer rates same employee multiple times
              key={`${rating.MAKH}-${rating.MANV}-${index}`} 
              className={styles.ratingCard}
            >
              <div className={styles.ratingHeader}>
                <div className={styles.stars}>{renderStarRating(rating.SOSAO)}</div>
                {rating.TENKH && (
                  <p className={styles.reviewer}>Đánh giá bởi: {rating.TENKH}</p>
                )}
              </div>
              <p className={styles.comment}>{rating.BINHLUAN || 'Không có nhận xét'}</p>
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào</p>
        )}
      </div>
    </div>
  );
}

export default EmployeeRatingDetails;