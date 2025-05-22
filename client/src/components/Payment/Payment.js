import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Payment.module.css';

const API = 'http://localhost:5000/api/payments';

// Hàm lấy giờ hiện tại theo giờ local của máy cho input datetime-local
function getLocalDatetimeString() {
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const MALICH = searchParams.get('MALICH');


  console.log('MALICH:', MALICH);

  const [formData, setFormData] = useState({
    MALICH: MALICH || '',
    MAKH: '',
    SOTIEN: '',
    HINHTHUCTHANHTOAN: '',
    NGAYTHANHTOAN: getLocalDatetimeString(),
    TRANGTHAI: 'PENDING'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [customerName, setCustomerName] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  // Validation states
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (MALICH) {
      axios.get(`http://localhost:5000/api/bookings/${MALICH}`)
        .then(response => {
          const data = response.data;
          console.log('Booking data:', data);
          setBookingDetails(data);
          setCustomerName(data.TENKH);
          setFormData(prev => ({
            ...prev,
            MAKH: data.MAKH ? data.MAKH.toString() : '',
            SOTIEN: data.GIATIEN !== undefined && data.GIATIEN !== null ? data.GIATIEN.toString() : '0'
          }));
        })
        .catch(() => setMessage({ text: 'Không thể tải dữ liệu lịch đặt hoặc khách hàng', type: 'error' }));
    }
  }, [MALICH]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.SOTIEN || parseFloat(formData.SOTIEN) <= 0) {
      newErrors.SOTIEN = 'Amount must be greater than 0';
    }
    
    
    if (!formData.NGAYTHANHTOAN) {
      newErrors.NGAYTHANHTOAN = 'Payment date is required';
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateForm();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        MAKH: parseInt(formData.MAKH, 10),
        SOTIEN: parseFloat(formData.SOTIEN),
        NGAYTHANHTOAN: new Date(formData.NGAYTHANHTOAN).toISOString(),
      };

      const response = await axios.post(API, payload);
      // Normalize receipt fields for display
      const receipt = {
        MAPHIEU: response.data.MAPHIEU || response.data.MATHANHTOAN,
        customer: response.data.customer || customerName,
        SOTIEN: response.data.SOTIEN || response.data.totalAmount || payload.SOTIEN,
        HINHTHUCTHANHTOAN: response.data.HINHTHUCTHANHTOAN || response.data.paymentMethod || formData.HINHTHUCTHANHTOAN,
        NGAYTHANHTOAN: response.data.NGAYTHANHTOAN || response.data.paymentDate || payload.NGAYTHANHTOAN,
      };
      setPaymentReceipt(receipt);
      setMessage({ text: 'Thanh toán thành công! Đang chuyển về trang đặt lịch...', type: 'success' });
      setShowConfirmation(true);

      // Update booking status (nếu lỗi chỉ log, không setMessage lỗi)
      try {
        await axios.put(`http://localhost:5000/api/bookings/${MALICH}`, {
          TRANGTHAI: 'Paid'
        });
      } catch (err) {
        console.error('Cập nhật trạng thái booking thất bại:', err);
        // Không setMessage lỗi ở đây
      }

      setTimeout(() => navigate('/booking'), 7000);
    } catch (err) {
      console.error('Error submitting payment:', err);
      setMessage({
        text: err.response?.data?.message || 'Payment failed. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.paymentPageWrapper}>
      <div className={styles.leftCol}>
        <div className={styles.bookingInfoCard}>
          <h2>Thông tin đặt lịch</h2>
          {bookingDetails && (
            <div className={styles.bookingInfoBox}>
              <p><strong>Mã lịch:</strong> {bookingDetails.MALICH}</p>
              <p><strong>Dịch vụ:</strong> {bookingDetails.TENDV}</p>
              <p><strong>Ngày đặt:</strong> {bookingDetails.THOIGIANBATDAU ? new Date(bookingDetails.THOIGIANBATDAU).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : ''}</p>
              <p><strong>Trạng thái:</strong> {bookingDetails.TRANGTHAI}</p>
            </div>
          )}
        </div>
        {showConfirmation && paymentReceipt && (
          <div className={styles.receiptContainer}>
            <h2>Biên nhận thanh toán</h2>
            <div className={styles.receiptDetails}>
              <p><strong>Số phiếu:</strong> {paymentReceipt.MAPHIEU}</p>
              <p><strong>Khách hàng:</strong> {paymentReceipt.customer}</p>
              <p><strong>Số tiền:</strong> {formatCurrency(paymentReceipt.SOTIEN)}</p>
              <p><strong>Hình thức thanh toán:</strong> {paymentReceipt.HINHTHUCTHANHTOAN}</p>
              <p><strong>Ngày thanh toán:</strong> {paymentReceipt.NGAYTHANHTOAN ? new Date(paymentReceipt.NGAYTHANHTOAN).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : ''}</p>
            </div>
          </div>
        )}
      </div>
      <div className={styles.rightCol}>
        <h1 className={styles.mainTitle}>Chi tiết thanh toán</h1>
        {/* Hiển thị message thành công hoặc lỗi nếu có */}
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
            <button className={styles.closeBtn} onClick={() => setMessage({ text: '', type: '' })}>×</button>
          </div>
        )}
        <div className={styles.cardContainer}>
          <form onSubmit={handleSubmit} className={styles.paymentForm}>
            <div className={styles.formGroup}>
              <label>Khách hàng</label>
              <input
                type="text"
                value={customerName}
                readOnly
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Số tiền (VND)</label>
              <input
                type="number"
                name="SOTIEN"
                value={formData.SOTIEN}
                onChange={handleFormChange}
                required
                className={`${styles.input} ${errors.SOTIEN ? styles.error : ''}`}
                placeholder="Nhập số tiền"
              />
              {errors.SOTIEN && <span className={styles.errorText}>{errors.SOTIEN}</span>}
            </div>
            <div className={styles.formGroup}>
              <label>Hình thức thanh toán</label>
              <select
                name="HINHTHUCTHANHTOAN"
                value={formData.HINHTHUCTHANHTOAN}
                onChange={handleFormChange}
                required
                className={`${styles.selectInput} ${errors.HINHTHUCTHANHTOAN ? styles.error : ''}`}
              >
                <option value="">-- Chọn hình thức --</option>
                <option value="Cash">Tiền mặt</option>
                <option value="Card">Thẻ tín dụng/Ghi nợ</option>
                <option value="Bank Transfer">Chuyển khoản</option>
                <option value="E-Wallet">Ví điện tử</option>
              </select>
              {errors.HINHTHUCTHANHTOAN && <span className={styles.errorText}>{errors.HINHTHUCTHANHTOAN}</span>}
            </div>
            <div className={styles.formGroup}>
              <label>Ngày thanh toán</label>
              <input
                type="datetime-local"
                name="NGAYTHANHTOAN"
                value={formData.NGAYTHANHTOAN}
                onChange={handleFormChange}
                required
                className={`${styles.input} ${errors.NGAYTHANHTOAN ? styles.error : ''}`}
              />
              {errors.NGAYTHANHTOAN && <span className={styles.errorText}>{errors.NGAYTHANHTOAN}</span>}
            </div>
            <button
              type="submit"
              disabled={loading || !isFormValid || !customerName || bookingDetails?.TRANGTHAI === 'Paid'}
              className={styles.primaryBtn}
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
            </button>
            {bookingDetails?.TRANGTHAI === 'Paid' && (
              <div className={styles.success}>Lịch này đã được thanh toán!</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}