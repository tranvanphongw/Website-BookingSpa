import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Booking.module.css';
import { jwtDecode } from 'jwt-decode'; // named import đúng cách

const API = 'http://localhost:5000/api/bookings';

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const makhFromQuery = searchParams.get('MAKH');

  // Lấy thông tin user từ token
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

  // Hàm lấy MALICH dạng số nguyên từ string, bỏ tiền tố chữ nếu có
  const parseBookingId = (str) => {
    if (!str) return null;
    const digits = str.match(/\d+/);
    return digits ? parseInt(digits[0], 10) : null;
  };

  const [formData, setFormData] = useState({
    MAKH: loggedInCustomer ? loggedInCustomer.MAKH : '',
    MANV: '',
    THOIGIANBATDAU: '',
    TRANGTHAI: 'Pending',
  });

  const [serviceType, setServiceType] = useState('');
  const [selectedService, setSelectedService] = useState('');

  const [serviceTypes, setServiceTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [isPackage, setIsPackage] = useState(false);
  const [packageType, setPackageType] = useState('');
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [packageDetails, setPackageDetails] = useState([]);

  const [services, setServices] = useState([]);

  // Load dữ liệu ban đầu: loại dịch vụ, nhân viên, lịch đặt
  useEffect(() => {
    const customerIdToFetch = makhFromQuery || loggedInCustomer?.MAKH;

    (async () => {
      setLoading(true);
      try {
        const [tRes, eRes, bRes] = await Promise.all([
          axios.get(`${API}/service-types`),
          axios.get(`${API}/employees`),
          axios.get(API, { params: { MAKH: customerIdToFetch } }),
        ]);
        setServiceTypes(tRes.data);
        setEmployees(eRes.data);
        setBookings(bRes.data);
      } catch (err) {
        console.error(err);
        setMessage({ text: 'Không thể tải dữ liệu', type: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, [loggedInCustomer?.MAKH, makhFromQuery]);

  // Load dịch vụ theo loại
  useEffect(() => {
    if (!serviceType) {
      setServices([]);
      setSelectedService('');
      return;
    }
    setLoading(true);
    axios
      .get(`${API}/services`, { params: { type: serviceType } })
      .then((r) => {
        setServices(r.data);
        setSelectedService(r.data[0]?.MADV || '');
      })
      .catch((err) => {
        console.error(err);
        setMessage({ text: 'Không thể tải dịch vụ', type: 'error' });
      })
      .finally(() => setLoading(false));
  }, [serviceType]);

  // Load gói dịch vụ khi chọn đặt gói
  useEffect(() => {
    if (isPackage) {
      axios
        .get('http://localhost:5000/api/packages')
        .then((res) => setPackages(res.data))
        .catch(() => setPackages([]));
    }
  }, [isPackage]);

  const typeFilteredPackages = packageType
    ? packages.filter((pkg) => pkg.MALOAI === parseInt(packageType, 10))
    : packages;

  useEffect(() => {
    if (selectedPackage) {
      axios
        .get(`http://localhost:5000/api/packages/${selectedPackage}/details`)
        .then((res) => setPackageDetails(res.data))
        .catch(() => setPackageDetails([]));
    } else {
      setPackageDetails([]);
    }
  }, [selectedPackage]);

  // Xử lý callback MoMo trả về (thanh toán)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const resultCode = searchParams.get('resultCode');
    const orderIdRaw = searchParams.get('orderId'); // Có thể là 'MOMO94' dạng chuỗi

    if (resultCode === '0' && orderIdRaw) {
      const orderId = parseBookingId(orderIdRaw); // Chuyển sang số nguyên, vd: 'MOMO94' => 94
      if (orderId === null) {
        setMessage({ text: 'Mã lịch không hợp lệ sau khi thanh toán', type: 'error' });
        return;
      }

      axios
        .get(`${API}/${orderId}`)
        .then((res) => {
          const updatedBooking = res.data;
          setMessage({ text: 'Thanh toán thành công!', type: 'success' });

          setBookings((prev) => {
            const idx = prev.findIndex((b) => b.MALICH === updatedBooking.MALICH);
            if (idx >= 0) {
              const newList = [...prev];
              newList[idx] = updatedBooking;
              return newList;
            }
            return [...prev, updatedBooking];
          });
        })
        .catch(() =>
          setMessage({ text: 'Không tải được thông tin đặt lịch sau thanh toán', type: 'error' })
        );

      // Xóa query param khỏi URL tránh gọi lại khi reload
      navigate('/booking', { replace: true });
    }
  }, [location.search, navigate]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loggedInCustomer) {
      setMessage({ text: 'Bạn phải đăng nhập để đặt lịch!', type: 'error' });
      return;
    }
      // Thêm kiểm tra thời gian
    const selectedDateTime = new Date(formData.THOIGIANBATDAU);
    const now = new Date();
    if (selectedDateTime < now) {
      setMessage({ text: 'Thời gian đặt lịch không thể ở trong quá khứ!', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      let payload;
      if (isPackage) {
        payload = {
          ...formData,
          MAKH: parseInt(loggedInCustomer.MAKH, 10),
          MANV: parseInt(formData.MANV, 10),
          MAGOI: parseInt(selectedPackage, 10),
          THOIGIANBATDAU: formData.THOIGIANBATDAU,
        };
      } else {
        payload = {
          ...formData,
          MAKH: parseInt(loggedInCustomer.MAKH, 10),
          MANV: parseInt(formData.MANV, 10),
          MADV: [parseInt(selectedService, 10)],
          THOIGIANBATDAU: formData.THOIGIANBATDAU,
        };
      }
      await axios.post(API, payload);
      setMessage({ text: 'Đặt lịch thành công!', type: 'success' });

      const bRes = await axios.get(API, { params: { MAKH: loggedInCustomer?.MAKH } });
      setBookings(bRes.data);

      setFormData((fd) => ({ ...fd, MANV: '', THOIGIANBATDAU: '' }));
      setServiceType('');
      setSelectedService('');
      setPackageType('');
      setSelectedPackage('');
      setIsPackage(false);
      setPackageDetails([]);
    } catch (err) {
      console.error(err);
      setMessage({ text: err.response?.data?.message || 'Đặt lịch thất bại', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy lịch đặt này?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/${id}`);
      setMessage({ text: 'Đã hủy lịch đặt', type: 'success' });

      const bRes = await axios.get(API, { params: { MAKH: loggedInCustomer?.MAKH } });
      setBookings(bRes.data);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Hủy lịch thất bại', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const goToPayment = (id) => {
    const bookingId = parseBookingId(String(id));
    if (bookingId === null) {
      setMessage({ text: 'Mã lịch không hợp lệ để thanh toán', type: 'error' });
      return;
    }
    navigate(`/payment?MALICH=${bookingId}`);
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
              <div><strong>Ngày:</strong> <span>${
                booking.THOIGIANBATDAU
                  ? new Date(booking.THOIGIANBATDAU).toLocaleDateString('vi-VN', {
                      timeZone: 'Asia/Ho_Chi_Minh',
                    })
                  : ''
              }</span></div>
              <div><strong>Khách hàng:</strong> <span>${booking.TENKH}</span></div>
              <div><strong>Dịch vụ:</strong> <span>${
                booking.MAGOI ? booking.TENGOI : booking.TENDV
              }</span></div>
              ${
                booking.MAGOI && serviceDetails.length > 0
                  ? `<div class="service-list">
                      <strong>Chi tiết gói dịch vụ:</strong>
                      <ul>
                        ${serviceDetails
                          .map((dv) => `<li>${dv.TEN} (${dv.GIATIEN.toLocaleString()}đ)</li>`)
                          .join('')}
                      </ul>
                    </div>`
                  : ''
              }
              <div><strong>Nhân viên:</strong> <span>${booking.TENNV}</span></div>
              <div><strong>Thời gian:</strong> <span>${
                booking.THOIGIANBATDAU
                  ? new Date(booking.THOIGIANBATDAU).toLocaleString('vi-VN', {
                      timeZone: 'Asia/Ho_Chi_Minh',
                    })
                  : ''
              }</span></div>
            </div>
            <div class="divider"></div>
            <div class="total">
              <span>Tổng cộng: ${
                booking.MAGOI
                  ? total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                  : (booking.GIATIEN || 0).toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    })
              }</span>
            </div>
            <div class="footer">
              <p>Cảm ơn Quý khách đã sử dụng dịch vụ của chúng tôi!</p>
              <p>Hẹn gặp lại quý khách lần sau.</p>
            </div>
          </div>
          <script>
            window.onload = function () {
              window.print();
              setTimeout(function () {
                window.close();
              }, 500);
            };
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

  return (
    <div className={styles.bookingContainer}>
      <h1 className={styles.mainTitle}>ĐẶT LỊCH DỊCH VỤ SPA</h1>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
          <button className={styles.closeBtn} onClick={() => setMessage({ text: '', type: '' })}>
            ×
          </button>
        </div>
      )}

      {!loggedInCustomer ? (
        <div className={styles.emptyState}>
          <p>
            Bạn cần <b>đăng nhập</b> để đặt lịch dịch vụ!
          </p>
        </div>
      ) : (
        <div className={styles.cardContainer}>
          <form onSubmit={handleSubmit} className={styles.bookingForm}>
            <div className={styles.formGroup}>
              <label>Khách hàng</label>
              <input type="text" value={loggedInCustomer?.TEN || ''} disabled className={styles.selectInput} />
              <input type="hidden" name="MAKH" value={loggedInCustomer?.MAKH || ''} />
            </div>

            <div>
              <label>
                <input type="radio" checked={!isPackage} onChange={() => setIsPackage(false)} />
                Đặt dịch vụ lẻ
              </label>
              <label style={{ marginLeft: 16 }}>
                <input type="radio" checked={isPackage} onChange={() => setIsPackage(true)} />
                Đặt gói dịch vụ
              </label>
            </div>

            {isPackage ? (
              <>
                <div className={styles.formGroup}>
                  <label>Loại dịch vụ</label>
                  <select
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="">-- Chọn loại --</option>
                    {serviceTypes.map((t) => (
                      <option key={t.MALOAI} value={t.MALOAI}>
                        {t.TENLOAI}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Gói dịch vụ</label>
                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="">-- Chọn gói --</option>
                    {typeFilteredPackages.map((pkg) => (
                      <option key={pkg.MAGOI} value={pkg.MAGOI}>
                        {pkg.TEN} ({pkg.GIATIEN.toLocaleString()}đ)
                      </option>
                    ))}
                  </select>
                </div>
                {packageDetails.length > 0 && (
                  <div className={styles.formGroup}>
                    <b>Dịch vụ trong gói:</b>
                    <ul>
                      {packageDetails.map((dv) => (
                        <li key={dv.MADV}>
                          {dv.TEN} ({dv.GIATIEN.toLocaleString()}đ)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Loại dịch vụ</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="">-- Tất cả loại --</option>
                    {serviceTypes.map((t) => (
                      <option key={t.MALOAI} value={t.MALOAI}>
                        {t.TENLOAI}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Dịch vụ</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    disabled={!serviceType}
                    className={styles.selectInput}
                  >
                    <option value="">-- Chọn dịch vụ --</option>
                    {services.map((s) => (
                      <option key={s.MADV} value={s.MADV}>
                        {s.TEN}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Nhân viên</label>
              <select
                name="MANV"
                value={formData.MANV}
                onChange={handleFormChange}
                required
                className={styles.selectInput}
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees.map((e) => (
                  <option key={e.MANV} value={e.MANV}>
                    {e.TEN}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Thời gian bắt đầu</label>
              <input
                type="datetime-local"
                name="THOIGIANBATDAU"
                value={formData.THOIGIANBATDAU}
                onChange={handleFormChange}
                required
                className={styles.timeInput}
              />
            </div>

            <button type="submit" disabled={loading} className={styles.primaryBtn}>
              {loading ? 'Đang xử lý...' : 'Đặt lịch ngay'}
            </button>
          </form>
        </div>
      )}

      {loggedInCustomer && (
        <>
          <h2>Lịch Đặt Của Bạn</h2>
          {bookings.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Chưa có lịch đặt nào. Hãy đặt lịch ở phía trên.</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.bookingsTable}>
                <thead>
                  <tr>
                    <th>Khách hàng</th>
                    <th>Dịch vụ</th>
                    <th>Nhân viên</th>
                    <th>Bắt đầu</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.MALICH} className={b.TRANGTHAI === 'Paid' ? styles.paidRow : ''}>
                      <td>{b.TENKH}</td>
                      <td>{b.TENGOI ? `Gói: ${b.TENGOI}` : b.TENDV}</td>
                      <td>{b.TENNV}</td>
                      <td>
                        {b.THOIGIANBATDAU
                          ? new Date(b.THOIGIANBATDAU).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
                          : ''}
                      </td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[b.TRANGTHAI.toLowerCase()]}`}>
                          {b.TRANGTHAI === 'Pending' && 'Chờ thanh toán'}
                          {b.TRANGTHAI === 'Processing' && 'Đang xử lý'}
                          {b.TRANGTHAI === 'Paid' && 'Đã thanh toán'}
                          {b.TRANGTHAI === 'Canceled' && 'Đã hủy'}
                        </span>
                      </td>
                      <td className={styles.actionBtns}>
                        {b.TRANGTHAI === 'Pending' ? (
                          <>
                            <button className={styles.paymentBtn} onClick={() => goToPayment(b.MALICH)}>
                              Thanh toán
                            </button>
                            <button className={styles.cancelBtn} onClick={() => handleCancel(b.MALICH)}>
                              Xóa
                            </button>
                          </>
                        ) : b.TRANGTHAI === 'Processing' ? (
                          <button className={styles.cancelBtn} onClick={() => handleCancel(b.MALICH)}>
                            Hủy
                          </button>
                        ) : b.TRANGTHAI === 'Paid' ? (
                          <>
                            <button className={styles.printBtn} onClick={() => handlePrintInvoicePopup(b)}>
                              In hóa đơn
                            </button>
                            <button
                              className={styles.ratingBtn}
                              onClick={() => (window.location.href = `http://localhost:3000/rating`)}
                              style={{ marginLeft: 8 }}
                            >
                              Đánh giá
                            </button>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
