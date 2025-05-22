import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Booking.module.css';
import { jwtDecode } from 'jwt-decode';

const API = 'http://localhost:5000/api/bookings';

export default function Booking() {
  const navigate = useNavigate();

  // Lấy thông tin user từ token
  const token = localStorage.getItem('token');
  let loggedInCustomer = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded && decoded.MAKH && decoded.TEN) {
        loggedInCustomer = { MAKH: decoded.MAKH, TEN: decoded.TEN };
      }
    } catch (e) { loggedInCustomer = null; }
  }

  // Form chính
  const [formData, setFormData] = useState({
    MAKH: loggedInCustomer ? loggedInCustomer.MAKH : '',
    MANV: '',
    THOIGIANBATDAU: '',
    TRANGTHAI: 'Pending'
  });
  const [multiple, setMultiple] = useState(false);

  // Single-service
  const [serviceType, setServiceType] = useState('');
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');

  // Multi-service
  const [rows, setRows] = useState([{ type:'', MADV:'', options:[] }]);

  // Data lookup
  const [serviceTypes, setServiceTypes] = useState([]);
  const [employees, setEmployees]       = useState([]);
  const [bookings, setBookings]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [message, setMessage]           = useState({ text:'', type:'' });

  // Print invoice
  const [printInvoiceData] = useState(null);

  // Load dropdown + bảng booking
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [tRes, eRes, bRes] = await Promise.all([
          axios.get(`${API}/service-types`),
          axios.get(`${API}/employees`),
          axios.get(API)
        ]);
        setServiceTypes(tRes.data);
        setEmployees(eRes.data);
        setBookings(bRes.data);
      } catch (err) {
        console.error(err);
        setMessage({ text:'Không thể tải dữ liệu', type:'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Khi đổi loại dịch vụ (single)
  useEffect(() => {
    if (!serviceType) {
      setServices([]);
      setSelectedService('');
      return;
    }
    setLoading(true);
    axios.get(`${API}/services`, { params: { type: serviceType } })
      .then(r => setServices(r.data))
      .catch(err => {
        console.error(err);
        setMessage({ text:'Không thể tải dịch vụ', type:'error' });
      })
      .finally(() => setLoading(false));
  }, [serviceType]);

  // Form change
  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };
  const toggleMultiple = e => {
    setMultiple(e.target.checked);
    setRows([{ type:'', MADV:'', options:[] }]);
    setServiceType(''); setSelectedService('');
  };

  // Multi-service handlers
  const onRowTypeChange = (i, val) => {
    const copy = [...rows];
    copy[i] = { ...copy[i], type: val, MADV:'', options:[] };
    setRows(copy);
    if (val) {
      axios.get(`${API}/services`, { params:{ type: val } })
        .then(r => {
          const c = [...copy];
          c[i].options = r.data;
          setRows(c);
        })
        .catch(console.error);
    }
  };
  const onRowServiceChange = (i, val) => {
    const copy = [...rows];
    copy[i].MADV = val;
    setRows(copy);
  };
  const addRow = () => setRows(r => [...r, { type:'', MADV:'', options:[] }]);
  const removeRow = i => {
    const f = rows.filter((_,idx)=>idx!==i);
    setRows(f.length ? f : [{ type:'', MADV:'', options:[] }]);
  };

  // Gửi form
  const handleSubmit = async e => {
    e.preventDefault();
    // Nếu chưa đăng nhập thì báo lỗi
    if (!loggedInCustomer) {
      setMessage({ text: 'Bạn phải đăng nhập để đặt lịch!', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const MADV = multiple
        ? rows.map(r=>parseInt(r.MADV,10)).filter(Boolean)
        : [ parseInt(selectedService,10) ];
      const payload = {
        ...formData,
        MAKH: parseInt(loggedInCustomer.MAKH,10),
        MANV: parseInt(formData.MANV,10),
        MADV,
        THOIGIANBATDAU: formData.THOIGIANBATDAU
      };
      await axios.post(API, payload);
      setMessage({ text:'Đặt lịch thành công!', type:'success' });
      const bRes = await axios.get(API);
      setBookings(bRes.data);
      // reset
      setFormData(fd => ({ ...fd, MANV:'', THOIGIANBATDAU:'' }));
      setServiceType(''); setSelectedService('');
      setRows([{ type:'', MADV:'', options:[] }]);
    } catch (err) {
      console.error(err);
      setMessage({ text: err.response?.data?.message || 'Đặt lịch thất bại', type:'error' });
    } finally {
      setLoading(false);
    }
  };

  // Xóa & Payment
  const handleCancel = async id => {
    if (!window.confirm('Bạn có chắc muốn hủy lịch đặt này?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API}/${id}`);
      setMessage({ text:'Đã hủy lịch đặt', type:'success' });
      const bRes = await axios.get(API);
      setBookings(bRes.data);
    } catch (err) {
      console.error(err);
      setMessage({ text:'Hủy lịch thất bại', type:'error' });
    } finally {
      setLoading(false);
    }
  };
  const goToPayment = id => navigate(`/payment?MALICH=${id}`);

  function handlePrintInvoicePopup(booking) {
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
              <div><strong>Dịch vụ:</strong> <span>${booking.TENDV}</span></div>
              <div><strong>Nhân viên:</strong> <span>${booking.TENNV}</span></div>
              <div><strong>Thời gian:</strong> <span>${booking.THOIGIANBATDAU ? new Date(booking.THOIGIANBATDAU).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : ''}</span></div>
            </div>
            <div class="divider"></div>
            <div class="total">
              <span>Tổng cộng: ${booking.GIATIEN ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.GIATIEN) : ''}</span>
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
      alert("Không thể mở cửa sổ in. Vui lòng kiểm tra cài đặt trình duyệt của bạn.");
    }
  }

  return (
    <div className={styles.bookingContainer}>
      <h1 className={styles.mainTitle}>ĐẶT LỊCH DỊCH VỤ SPA</h1>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
          <button className={styles.closeBtn} onClick={()=>setMessage({text:'',type:''})}>×</button>
        </div>
      )}

      {/* Nếu chưa đăng nhập thì không cho đặt lịch */}
      {!loggedInCustomer ? (
        <div className={styles.emptyState}>
          <p>Bạn cần <b>đăng nhập</b> để đặt lịch dịch vụ!</p>
        </div>
      ) : (
        <div className={styles.cardContainer}>
          <form onSubmit={handleSubmit} className={styles.bookingForm}>
            {/* Customer */}
            <div className={styles.formGroup}>
              <label>Khách hàng</label>
              <input type="text" value={loggedInCustomer ? loggedInCustomer.TEN : ''} disabled className={styles.selectInput} />
              <input type="hidden" name="MAKH" value={loggedInCustomer ? loggedInCustomer.MAKH : ''} />
            </div>

            {/* Multiple toggle */}
            <div className={styles.formGroup}>
              <div className={styles.multipleServiceRow}>
                <span>Đặt nhiều dịch vụ?</span>
                <input
                  type="checkbox"
                  checked={multiple}
                  onChange={toggleMultiple}
                  className={styles.checkbox}
                />
              </div>
            </div>

            {/* Single vs Multi */}
            {!multiple ? (
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Loại dịch vụ</label>
                  <select
                    value={serviceType}
                    onChange={e=>setServiceType(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="">-- Tất cả loại --</option>
                    {serviceTypes.map(t=>(
                      <option key={t.MALOAI} value={t.MALOAI}>{t.TENLOAI}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Dịch vụ</label>
                  <select
                    value={selectedService}
                    onChange={e=>setSelectedService(e.target.value)}
                    disabled={!serviceType}
                    className={styles.selectInput}
                  >
                    <option value="">-- Chọn dịch vụ --</option>
                    {services.map(s=>(
                      <option key={s.MADV} value={s.MADV}>{s.TEN}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              rows.map((row, idx) => (
                <div className={styles.serviceRow} key={idx}>
                  <div className={styles.formGroup}>
                    <label>Loại dịch vụ</label>
                    <select
                      value={row.type}
                      onChange={e=>onRowTypeChange(idx, e.target.value)}
                      className={styles.selectInput}
                    >
                      <option value="">-- Tất cả loại --</option>
                      {serviceTypes.map(t=>(
                        <option key={t.MALOAI} value={t.MALOAI}>{t.TENLOAI}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Dịch vụ</label>
                    <select
                      value={row.MADV}
                      onChange={e=>onRowServiceChange(idx, e.target.value)}
                      disabled={!row.type}
                      className={styles.selectInput}
                    >
                      <option value="">-- Chọn dịch vụ --</option>
                      {row.options.map(s=>(
                        <option key={s.MADV} value={s.MADV}>{s.TEN}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.btnWrapper}>
                    {idx === 0
                      ? <button type="button" className={styles.addBtn} onClick={addRow}>+ Thêm</button>
                      : <button type="button" className={styles.removeBtn} onClick={()=>removeRow(idx)}>Xóa</button>
                    }
                  </div>
                </div>
              ))
            )}

            {/* Employee */}
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
                {employees.map(e=>(
                  <option key={e.MANV} value={e.MANV}>{e.TEN}</option>
                ))}
              </select>
            </div>

            {/* Start Time */}
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

      {/* Table */}
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
                  {bookings.map(b => (
                    <tr key={b.MALICH} className={b.TRANGTHAI === 'Paid' ? styles.paidRow : ''}>
                      <td>{b.TENKH}</td>
                      <td>{b.TENDV}</td>
                      <td>{b.TENNV}</td>
                      <td>
                        {b.THOIGIANBATDAU
                          ? new Date(b.THOIGIANBATDAU).toLocaleString('vi-VN', {
                              timeZone: 'Asia/Ho_Chi_Minh',
                            })
                          : ''
                        }
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
                            <button className={styles.paymentBtn} onClick={()=>goToPayment(b.MALICH)}>
                              Thanh toán
                            </button>
                            <button className={styles.cancelBtn} onClick={()=>handleCancel(b.MALICH)}>
                              Xóa
                            </button>
                          </>
                        ) : b.TRANGTHAI === 'Processing' ? (
                          <button className={styles.cancelBtn} onClick={()=>handleCancel(b.MALICH)}>
                            Hủy
                          </button>
                        ) : b.TRANGTHAI === 'Paid' ? (
                          <>
                            <button className={styles.printBtn} onClick={() => handlePrintInvoicePopup(b)}>
                              In hóa đơn
                            </button>
                            <button
                              className={styles.ratingBtn}
                              onClick={() => window.location.href = `http://localhost:3000/rating`}
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

      {/* Render template hóa đơn khi printInvoiceData có dữ liệu */}
      {printInvoiceData && (
        <div id="spa-invoice">
          <div style={{textAlign:'center', fontWeight:'bold', fontSize:'1.2rem', marginBottom:8}}>SPA HOÀNG PHÚC</div>
          <div style={{textAlign:'center', fontSize:'0.95rem', marginBottom:4}}>
            Địa chỉ: Số 1, Đường ABC, TP.HCM<br/>
            ĐT: 0123456789
          </div>
          <div style={{textAlign:'center', fontWeight:'bold', fontSize:'1.1rem', margin:'10px 0'}}>HÓA ĐƠN DỊCH VỤ SPA</div>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.98rem', marginBottom:4}}>
            <span>Ngày: {printInvoiceData.THOIGIANBATDAU ? new Date(printInvoiceData.THOIGIANBATDAU).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : ''}</span>
            <span>Mã lịch: {printInvoiceData.MALICH}</span>
          </div>
          <div style={{fontSize:'0.98rem', marginBottom:4}}>Khách hàng: {printInvoiceData.TENKH}</div>
          <div style={{fontSize:'0.98rem', marginBottom:4}}>Dịch vụ: {printInvoiceData.TENDV}</div>
          <div style={{fontSize:'0.98rem', marginBottom:4}}>Nhân viên: {printInvoiceData.TENNV}</div>
          <div style={{fontSize:'0.98rem', marginBottom:4}}>Thời gian: {printInvoiceData.THOIGIANBATDAU ? new Date(printInvoiceData.THOIGIANBATDAU).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : ''}</div>
          <div style={{borderTop:'1px dashed #222', margin:'10px 0'}}></div>
          <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:'1.05rem'}}>
            <span>Tổng cộng:</span>
            <span>{printInvoiceData.GIATIEN ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(printInvoiceData.GIATIEN) : ''}</span>
          </div>
          <div style={{textAlign:'center', marginTop:12, fontSize:'0.98rem'}}>Cảm ơn Quý khách! Hẹn gặp lại!</div>
        </div>
      )}
    </div>
  );
}