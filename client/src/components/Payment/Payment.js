import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


import styles from './Payment.module.css';

const API = 'http://localhost:5000/api';
const API_MOMO = `${API}/payment/create`;
const API_CASH = `${API}/payment/cash`;

// Hàm chuyển chuỗi chứa mã booking thành số nguyên (loại bỏ tiền tố chữ)
function parseBookingId(str) {
  if (!str) return null;
  const digits = str.match(/\d+/);
  return digits ? parseInt(digits[0], 10) : null;
}

function getLocalDatetimeString() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export default function Payment() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bookingIdRaw = searchParams.get('MALICH');
  const bookingId = parseBookingId(bookingIdRaw);

  const token = localStorage.getItem('token');
  let loggedInCustomer = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded && decoded.MAKH && decoded.TEN) {
        loggedInCustomer = { MAKH: decoded.MAKH, TEN: decoded.TEN };
      }
    } catch (e) {
      loggedInCustomer = null;
    }
  }

  const [booking, setBooking] = useState(null);
  const [packageDetails, setPackageDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [paymentMethod, setPaymentMethod] = useState('MoMo');

  useEffect(() => {
    if (!bookingId) {
      setMessage({ text: 'Không tìm thấy thông tin đặt lịch hoặc mã không hợp lệ!', type: 'error' });
      return;
    }

    const fetchBooking = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API}/bookings/${bookingId}`);
        setBooking(response.data);

        if (response.data.MAGOI) {
          const pkgRes = await axios.get(`${API}/packages/${response.data.MAGOI}/details`);
          setPackageDetails(pkgRes.data);
        } else {
          setPackageDetails([]);
        }
      } catch (err) {
        setMessage({ text: 'Không thể tải thông tin đặt lịch!', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleMoMoPayment = async () => {
    if (!loggedInCustomer || !booking) return;

    setLoading(true);
    try {
      const extraData = JSON.stringify({ MALICH: booking.MALICH, MAKH: loggedInCustomer.MAKH });

      const response = await axios.post(API_MOMO, {
        amount: booking.MAGOI ? booking.GIAGOI : booking.GIATIEN,
        orderInfo: `Thanh toán lịch ${booking.MALICH}`,
        orderId: `MOMO${booking.MALICH}`,
        extraData,
      });

      const { payUrl } = response.data;
      if (payUrl) {
        window.location.href = payUrl;
      } else {
        setMessage({ text: 'Không lấy được URL thanh toán MoMo', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Lỗi khi tạo đơn thanh toán MoMo', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCashPayment = async () => {
    if (!loggedInCustomer || !booking) return;

    setLoading(true);
    try {
      const response = await axios.post(API_CASH, {
        MALICH: booking.MALICH,
        MAKH: loggedInCustomer.MAKH,
        SOTIEN: booking.MAGOI ? booking.GIAGOI : booking.GIATIEN,
      });
      setMessage({ text: response.data.message || 'Thanh toán tiền mặt thành công', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Lỗi khi thanh toán tiền mặt', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'MoMo') {
      await handleMoMoPayment();
    } else if (paymentMethod === 'Cash') {
      await handleCashPayment();
    }
  };

  return (
    <div className={styles.paymentPageWrapper}>
      <div className={styles.leftCol}>
        <div className={styles.bookingInfoCard}>
          <h2>Thông tin đặt lịch</h2>
          {booking && (
            <div className={styles.bookingInfoBox}>
              <p><strong>Mã lịch:</strong> {booking.MALICH}</p>
              <p><strong>Dịch vụ:</strong> {booking.TENGOI || booking.TENDV}</p>
              {booking.MAGOI && packageDetails.length > 0 && (
                <div>
                  <strong>Chi tiết gói dịch vụ:</strong>
                  <ul>
                    {packageDetails.map(dv => (
                      <li key={dv.MADV}>{dv.TEN} ({dv.GIATIEN.toLocaleString()} đ)</li>
                    ))}
                  </ul>
                </div>
              )}
              <p>
                <strong>Ngày đặt: </strong>
                {booking.THOIGIANBATDAU
                  ? new Date(booking.THOIGIANBATDAU.replace('Z', '')).toLocaleString('vi-VN')
                  : ''}
              </p>
              <p><strong>Trạng thái:</strong> {booking.TRANGTHAI}</p>
            </div>
          )}
        </div>
      </div>
      <div className={styles.rightCol}>
        <h1 className={styles.mainTitle}>Chi tiết thanh toán</h1>
        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        <div className={styles.cardContainer}>
          <form onSubmit={handlePayment} className={styles.paymentForm}>
            <div className={styles.formGroup}>
              <label>Khách hàng</label>
              <input
                type="text"
                value={loggedInCustomer ? loggedInCustomer.TEN : ''}
                readOnly
                disabled
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Số tiền (VND)</label>
              <input
                type="number"
                value={booking ? (booking.MAGOI ? booking.GIAGOI : booking.GIATIEN) : ''}
                readOnly
                disabled
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Hình thức thanh toán</label>
              <select
                className={styles.selectInput}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                disabled={loading}
              >
                <option value="MoMo">Thanh toán MoMo</option>
                <option value="Cash">Thanh toán Tiền mặt</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Ngày thanh toán</label>
              <input
                type="datetime-local"
                value={getLocalDatetimeString()}
                readOnly
                className={styles.input}
              />
            </div>
            <button type="submit" disabled={loading} className={styles.primaryBtn}>
              {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
