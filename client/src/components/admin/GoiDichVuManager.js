import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function GoiDichVuManager() {
  const [gois, setGois] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    TEN: '',
    MOTA: '',
    GIATIEN: '',
    MALOAI: ''
  });
  const [editId, setEditId] = useState(null);

  const fetchGois = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/goidichvu');
      if (!res.ok) throw new Error('Lấy danh sách gói thất bại');
      const data = await res.json();
      setGois(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGois();
  }, []);

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:5000/api/goidichvu/${editId}` : 'http://localhost:5000/api/goidichvu';

    try {
      const res = await fetch(url, {
        method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Lỗi khi lưu gói dịch vụ');
      setFormData({ TEN: '', MOTA: '', GIATIEN: '', MALOAI: '' });
      setEditId(null);
      fetchGois();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (goi) => {
    setFormData({
      TEN: goi.TEN,
      MOTA: goi.MOTA,
      GIATIEN: goi.GIATIEN,
      MALOAI: goi.MALOAI
    });
    setEditId(goi.MAGOI);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa gói này?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/goidichvu/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xóa gói thất bại');
      fetchGois();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Quản lý Gói Dịch Vụ</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Tên Gói</label>
          <input type="text" name="TEN" value={formData.TEN} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Mô Tả</label>
          <textarea name="MOTA" value={formData.MOTA} onChange={handleChange} className="form-control" rows="3" />
        </div>
        <div className="mb-3">
          <label className="form-label">Giá Tiền</label>
          <input type="number" name="GIATIEN" value={formData.GIATIEN} onChange={handleChange} className="form-control" required min="0" step="0.01" />
        </div>
        <div className="mb-3">
          <label className="form-label">Mã Loại</label>
          <input type="number" name="MALOAI" value={formData.MALOAI} onChange={handleChange} className="form-control" required min="0" />
        </div>

        <button type="submit" className="btn btn-primary me-2">{editId ? 'Cập Nhật' : 'Thêm Gói'}</button>
        {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setFormData({ TEN: '', MOTA: '', GIATIEN: '', MALOAI: '' }); }}>Hủy</button>}
      </form>

      {loading && <div>Đang tải danh sách gói...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Mã Gói</th>
              <th>Tên</th>
              <th>Mô Tả</th>
              <th>Giá Tiền</th>
              <th>Mã Loại</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {gois.map(goi => (
              <tr key={goi.MAGOI}>
                <td>{goi.MAGOI}</td>
                <td>{goi.TEN}</td>
                <td>{goi.MOTA}</td>
                <td>{goi.GIATIEN.toLocaleString()}</td>
                <td>{goi.MALOAI}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(goi)}>Sửa</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(goi.MAGOI)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GoiDichVuManager;
