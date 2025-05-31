import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookingManager.css';

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      const bookings = res.data;

      // Lấy dịch vụ con và tổng tiền cho các booking gói
      const bookingsWithDetails = await Promise.all(
        bookings.map(async (b) => {
          if (b.MAGOI) {
            try {
              const detailsRes = await axios.get(`http://localhost:5000/api/packages/${b.MAGOI}/details`);
              const packageDetails = detailsRes.data;
              const total = packageDetails.reduce((sum, dv) => sum + (dv.GIATIEN || 0), 0);
              return { ...b, packageDetails, packageTotal: total };
            } catch {
              return { ...b, packageDetails: [], packageTotal: 0 };
            }
          }
          // Dịch vụ lẻ
          return { ...b, packageDetails: null, packageTotal: b.GIATIEN || 0 };
        })
      );
      setBookings(bookingsWithDetails);
    } catch (err) {
      setError('Không thể tải danh sách đặt lịch!');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => 
    filter === 'all' ? true : b.TRANGTHAI === filter
  );

  const handleStatusChange = async (MALICH, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${MALICH}`, {
        MALICH,
        TRANGTHAI: newStatus
      });
      fetchBookings();
    } catch (err) {
      alert('Cập nhật trạng thái thất bại!');
    }
  };

  async function handlePrintInvoicePopup(booking) {
    let serviceDetails = [];
    let total = 0;
    if (booking.MAGOI) {
      try {
        const res = await axios.get(`http://localhost:5000/api/packages/${booking.MAGOI}/details`);
        serviceDetails = res.data;
        total = serviceDetails.reduce((sum, dv) => sum + (dv.GIATIEN || 0), 0);
      } catch {
        serviceDetails = [];
        total = 0;
      }
    }

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Hóa Đơn - SPA BOOKING </title>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            .invoice-container { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px dashed #ddd; padding-bottom: 10px; }
            .header h1 { margin: 0; color: #22594e; font-size: 24px; }
            .header p { margin: 5px 0; font-size: 14px; }
            .invoice-title { text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; text-transform: uppercase; }
            .invoice-details { margin-bottom: 20px; }
            .invoice-details div { margin-bottom: 8px; display: flex; }
            .invoice-details div strong { display: inline-block; width: 150px; }
            .divider { border-top: 1px dashed #ddd; margin: 15px 0; }
            .total { font-weight: bold; font-size: 16px; text-align: right; margin: 15px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
            .footer p { margin: 5px 0; }
            .service-list { margin: 10px 0; }
            .service-list li { margin: 5px 0; }
            @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } .invoice-container { border: none; } }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <h1>SPA BOOKING</h1>
              <p>Địa chỉ: Số 1, Đường ABC, TP.HCM</p>
              <p>Điện thoại: 0123456789</p>
            </div>
            <div class="invoice-title">HÓA ĐƠN DỊCH VỤ SPA</div>
            <div class="invoice-details">
              <div><strong>Mã lịch:</strong> <span>${booking.MALICH}</span></div>
              <div><strong>Ngày:</strong> <span>${booking.THOIGIANBATDAU ? new Date(booking.THOIGIANBATDAU).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : ''}</span></div>
              <div><strong>Khách hàng:</strong> <span>${booking.TENKH}</span></div>
              <div><strong>Dịch vụ:</strong> <span>${booking.MAGOI ? booking.TENGOI : booking.TENDV}</span></div>
              ${
                booking.MAGOI && serviceDetails.length > 0
                  ? `<div class="service-list">
                      <strong>Chi tiết gói dịch vụ:</strong>
                      <ul>
                        ${serviceDetails.map(dv => `<li>${dv.TEN} (${dv.GIATIEN.toLocaleString()}đ)</li>`).join('')}
                      </ul>
                    </div>`
                  : ''
              }
              <div><strong>Nhân viên:</strong> <span>${booking.TENNV}</span></div>
              <div><strong>Thời gian:</strong> <span>${booking.THOIGIANBATDAU ? new Date(booking.THOIGIANBATDAU).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : ''}</span></div>
            </div>
            <div class="divider"></div>
            <div class="total">
              <span>Tổng cộng: ${
                booking.MAGOI
                  ? total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                  : (booking.GIATIEN || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
              }</span>
            </div>
            <div class="footer">
              <p>Cảm ơn Quý khách đã sử dụng dịch vụ của chúng tôi!</p>
              <p>Hẹn gặp lại quý khách lần sau.</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
        </html>
      `;
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
    } else {
      alert('Không thể mở cửa sổ in. Vui lòng kiểm tra cài đặt trình duyệt của bạn.');
    }
  }

  async function handleDeleteBooking(MALICH) {
    if (!window.confirm('Bạn có chắc muốn xóa lịch này?')) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${MALICH}`);
      fetchBookings();
    } catch (err) {
      console.error('Delete error:', err, err?.response);
      alert('Xóa lịch thất bại!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="booking-manager">
      <h1>Quản lý đặt lịch</h1>
      
      <div className="filter-section">
        <label>Lọc trạng thái: </label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="Pending">Chờ thanh toán</option>
          <option value="Processing">Đang xử lý</option>
          <option value="Paid">Đã thanh toán</option>
        </select>
        <button onClick={fetchBookings} className="refresh-btn">
          Làm mới
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Mã lịch</th>
              <th>Khách hàng</th>
              <th>Dịch vụ</th>
              <th>Nhân viên</th>
              <th>Bắt đầu</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(b => (
              <tr key={b.MALICH}>
                <td>{b.MALICH}</td>
                <td>{b.TENKH}</td>
                <td>
                  {b.TENGOI
                    ? `Gói: ${b.TENGOI}`
                    : b.TENDV}
                </td>
                <td>{b.TENNV}</td>
                <td>{b.THOIGIANBATDAU ? new Date(b.THOIGIANBATDAU).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : ''}</td>
                <td>
                  <select 
                    value={b.TRANGTHAI} 
                    onChange={(e) => handleStatusChange(b.MALICH, e.target.value)}
                    className={`status-select ${b.TRANGTHAI.toLowerCase()}`}
                  >
                    <option value="Pending">Chờ thanh toán</option>
                    <option value="Processing">Đang xử lý</option>
                    <option value="Paid">Đã thanh toán</option>
                  </select>
                </td>
                <td className="action-buttons">
                  <button onClick={async () => await handlePrintInvoicePopup(b)} className="print-btn">
                    In hóa đơn
                  </button>
                  <button onClick={() => handleDeleteBooking(b.MALICH)} className="delete-btn">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {loading && <div className="loading">Đang tải...</div>}
    </div>
  );
};

export default BookingManager; 