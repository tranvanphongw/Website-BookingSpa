import React, { useState, useEffect } from 'react';

function AdminPayments() {
  const [viewAll, setViewAll] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [submittedId, setSubmittedId] = useState(null);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Gọi API theo viewAll hoặc submittedId
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = '';
        if (viewAll) {
          url = 'http://localhost:5000/api/payment/all';
        } else if (submittedId) {
          url = `http://localhost:5000/api/payment/customer/${submittedId}`;
        } else {
          setPayments([]);
          setLoading(false);
          return;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Lấy dữ liệu thất bại');
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewAll, submittedId]);

  // Xử lý submit tìm theo mã khách
  const handleSubmit = (e) => {
    e.preventDefault();
    const idStr = String(customerId).trim();
    if (idStr && !isNaN(idStr)) {
      setSubmittedId(idStr);
      setViewAll(false);
    } else {
      alert('Vui lòng nhập mã khách hàng hợp lệ');
      setSubmittedId(null);
    }
  };

  // Xử lý xem tất cả thanh toán
  const handleViewAllClick = () => {
    setViewAll(true);
    setSubmittedId(null);
    setCustomerId('');
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Quản lý Thanh toán</h1>

      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <form className="d-flex" onSubmit={handleSubmit}>
            <input
              type="number"
              className="form-control me-2"
              placeholder="Nhập mã khách hàng (MAKH)"
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              // Bỏ disabled để luôn có thể nhập
            />
            <button type="submit" className="btn btn-primary">
              Xem Thanh Toán Theo Khách
            </button>
          </form>
        </div>

        <div className="col-md-6 text-md-end mt-3 mt-md-0">
          <button className="btn btn-success" onClick={handleViewAllClick}>
            Xem Tất Cả Thanh Toán
          </button>
        </div>
      </div>

      {loading && <div className="alert alert-info">Đang tải danh sách thanh toán...</div>}
      {error && <div className="alert alert-danger">Lỗi: {error}</div>}

      {!loading && !error && payments.length === 0 && (
        <div className="alert alert-warning">
          {viewAll
            ? 'Không có thanh toán nào.'
            : submittedId
            ? `Không tìm thấy thanh toán cho khách hàng #${submittedId}`
            : 'Vui lòng nhập mã khách hàng để xem thanh toán.'}
        </div>
      )}

      {!loading && !error && payments.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-light">
              <tr>
                <th>Mã Thanh Toán</th>
                <th>Mã Lịch</th>
                <th>Mã Khách</th>
                <th>Tên Khách Hàng</th>
                <th>Số Tiền</th>
                <th>Ngày Thanh Toán</th>
                <th>Hình Thức Thanh Toán</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.MATHANHTOAN}>
                  <td>{p.MATHANHTOAN}</td>
                  <td>{p.MALICH}</td>
                  <td>{p.MAKH}</td>
                  <td>{p.TENKH || 'Chưa có'}</td> {/* TENKH cần backend trả về */}
                  <td>{Number(p.SOTIEN).toLocaleString()}</td>
                  <td>{new Date(p.NGAYTHANHTOAN).toLocaleString()}</td>
                  <td>{p.HINHTHUCTHANHTOAN}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPayments;
