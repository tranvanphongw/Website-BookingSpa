import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import styles from './EmployeeScheduling.module.css';

const API_URL = 'http://localhost:5000/api';

const EmployeeScheduling = () => {
  const [schedules, setSchedules] = useState([]);
  const [employees, setEmployees] = useState([]);
  // Update form data to use correct column names
  const [formData, setFormData] = useState({
    MANV: '',
    NGAYLAM: format(new Date(), 'yyyy-MM-dd'),
    THOIGIANBATDAU: '09:00',  // Changed from GIOBATDAU
    THOIGIANKETTHUC: '17:00', // Changed from GIOKETTHUC
    GHICHU: '',
    TRANGTHAI: 1 // Add default TRANGTHAI value
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [filterDate, setFilterDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  //const [filterEmployee, setFilterEmployee] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all schedules and employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch schedules based on filters
  useEffect(() => {
    if (filterDate) {
      fetchSchedulesByDate(filterDate);
    } else {
      fetchSchedules();
    }
  }, [filterDate]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setMessage('Failed to load employees');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/schedules`);
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setMessage('Failed to load schedules');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchedulesByDate = async (date) => {
    setIsLoading(true);
    try {
      // Validate the date format
      if (!date || isNaN(new Date(date).getTime())) {
        throw new Error('Invalid date format');
      }
      
      console.log('Fetching schedules for date:', date);
      const response = await axios.get(`${API_URL}/schedules/date/${date}`);
      console.log('Response data:', response.data);
      setSchedules(response.data);
      setIsError(false);
    } catch (error) {
      console.error('Error fetching schedules by date:', error);
      setMessage(`Failed to load schedules: ${error.response?.data?.message || error.message}`);
      setIsError(true);
      // Fallback to empty array on error
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!formData.MANV || !formData.NGAYLAM || !formData.THOIGIANBATDAU || !formData.THOIGIANKETTHUC) {
      setMessage('Vui lòng điền đầy đủ thông tin bắt buộc');
      setIsError(true);
      return;
    }
    
    // Validate date format
    const dateObj = new Date(formData.NGAYLAM);
    if (isNaN(dateObj.getTime())) {
      setMessage('Định dạng ngày không hợp lệ');
      setIsError(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Submitting schedule data:', formData);
      
      // Make a copy of formData with ensured TRANGTHAI as integer
      const submitData = {
        ...formData,
        TRANGTHAI: parseInt(formData.TRANGTHAI, 10)
      };
      
      if (editingId) {
        const response = await axios.put(`${API_URL}/schedules/${editingId}`, submitData);
        console.log('Update response:', response.data);
        setMessage('Cập nhật lịch làm việc thành công!');
      } else {
        const response = await axios.post(`${API_URL}/schedules`, submitData);
        console.log('Create response:', response.data);
        setMessage('Thêm lịch làm việc thành công!');
      }
      
      setIsError(false);
      resetForm();
      
      // Refresh schedules based on current filter
      if (filterDate) {
        fetchSchedulesByDate(filterDate);
      } else {
        fetchSchedules();
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      
      let errorMessage = 'Lỗi khi lưu lịch làm việc';
      if (error.response?.data) {
        // Display more detailed error information from backend
        const backendError = error.response.data;
        errorMessage = backendError.message || errorMessage;
        
        // Show SQL error details if available
        if (backendError.sqlError) {
          console.error('SQL Error details:', backendError.sqlError);
        }
        
        // Show missing columns if that's the issue
        if (backendError.missingColumns) {
          errorMessage += `: Thiếu cột ${backendError.missingColumns.join(', ')}`;
        }
      } else if (error.message) {
        errorMessage = `${errorMessage}: ${error.message}`;
      }
      
      setMessage(errorMessage);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (schedule) => {
    setFormData({
      MANV: schedule.MANV.toString(),
      NGAYLAM: format(new Date(schedule.NGAYLAM), 'yyyy-MM-dd'),
      THOIGIANBATDAU: schedule.THOIGIANBATDAU?.substring(0, 5) || '09:00', // Changed from GIOBATDAU
      THOIGIANKETTHUC: schedule.THOIGIANKETTHUC?.substring(0, 5) || '17:00', // Changed from GIOKETTHUC
      GHICHU: schedule.GHICHU || '',
      TRANGTHAI: schedule.TRANGTHAI || 1
    });
    setEditingId(schedule.MALICH);
    setMessage('');
    setIsError(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch làm việc này?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/schedules/${id}`);
      setMessage('Schedule deleted successfully!');
      setIsError(false);
      
      // Refresh schedules
      if (filterDate) {
        fetchSchedulesByDate(filterDate);
      } else {
        fetchSchedules();
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      setMessage('Failed to delete schedule');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      MANV: '',
      NGAYLAM: format(new Date(), 'yyyy-MM-dd'),
      THOIGIANBATDAU: '09:00',  // Changed from GIOBATDAU
      THOIGIANKETTHUC: '17:00', // Changed from GIOKETTHUC
      GHICHU: '',
      TRANGTHAI: 1
    });
    setEditingId(null);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTimeFromDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';

  try {
    const timeStr = String(dateTimeString).trim();

    // Case 1: "1900-01-01 HH:mm:ss.000"
    if (timeStr.includes('1900-01-01') && timeStr.includes(' ')) {
      const parts = timeStr.split(' ');
      if (parts.length > 1 && parts[1]) {
        const [hh, mm] = parts[1].split(':');
        if (hh !== undefined && mm !== undefined) {
          return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}`;
        }
      }
      return 'N/A';
    }

    // Case 2: "1900-01-01THH:mm:ss.000Z"
    if (timeStr.includes('T')) {
      // Lấy phần sau chữ T, ví dụ: "09:00:00.000Z"
      const tPart = timeStr.split('T')[1];
      if (tPart) {
        const [hh, mm] = tPart.split(':');
        if (hh !== undefined && mm !== undefined) {
          return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}`;
        }
      }
      return 'N/A';
    }

    // Case 3: "HH:mm" hoặc "HH:mm:ss"
    if (timeStr.match(/^\d{2}:\d{2}/)) {
      const [hh, mm] = timeStr.split(':');
      if (hh !== undefined && mm !== undefined) {
        return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}`;
      }
    }

    return 'N/A';
  } catch (error) {
    console.error('Error formatting time:', error, {
      input: dateTimeString,
      type: typeof dateTimeString
    });
    return 'N/A';
  }
};

  return (
    <div className={styles['form-container']}>
      <h1>Quản Lý Lịch Làm Việc Nhân Viên</h1>

      {/* Filter section */}
      <div className={styles['filter-section']}>
        <h3>Bộ lọc theo ngày</h3>
        <div className={styles['filter-controls']}>
          <div>
            <label>Chọn ngày:</label>
            <input 
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => setFilterDate('')}
            disabled={isLoading}
          >
            Xem tất cả
          </button>
        </div>
      </div>

      {/* Form to add/edit schedule */}
      <form onSubmit={handleSubmit} className={styles['schedule-form']}>
        <h3>{editingId ? 'Cập nhật lịch làm việc' : 'Thêm lịch làm việc mới'}</h3>
        
        <div className={styles['form-group']}>
          <label>Nhân viên:</label>
          <select 
            value={formData.MANV}
            onChange={(e) => setFormData({...formData, MANV: e.target.value})}
            required
          >
            <option value="">Chọn nhân viên</option>
            {employees.map(emp => (
              <option key={emp.MANV} value={emp.MANV}>{emp.TEN}</option>
            ))}
          </select>
        </div>

        <div className={styles['form-group']}>
          <label>Ngày làm việc:</label>
          <input 
            type="date"
            value={formData.NGAYLAM}
            onChange={(e) => setFormData({...formData, NGAYLAM: e.target.value})}
            required
          />
        </div>

        <div className={styles['form-row']}>
          <div className={styles['form-group']}>
            <label>Giờ bắt đầu:</label>
            <input 
              type="time"
              value={formData.THOIGIANBATDAU} // Changed from GIOBATDAU
              onChange={(e) => setFormData({...formData, THOIGIANBATDAU: e.target.value})} // Changed
              required
            />
          </div>

          <div className={styles['form-group']}>
            <label>Giờ kết thúc:</label>
            <input 
              type="time"
              value={formData.THOIGIANKETTHUC} // Changed from GIOKETTHUC
              onChange={(e) => setFormData({...formData, THOIGIANKETTHUC: e.target.value})} // Changed
              required
            />
          </div>
        </div>

        <div className={styles['form-group']}>
          <label>Ghi chú:</label>
          <textarea 
            value={formData.GHICHU}
            onChange={(e) => setFormData({...formData, GHICHU: e.target.value})}
            rows="3"
          />
        </div>
        
        <div className={styles['form-group']}>
          <label>Trạng thái:</label>
          <select
            value={formData.TRANGTHAI}
            onChange={(e) => setFormData({...formData, TRANGTHAI: parseInt(e.target.value, 10)})}
          >
            <option value={1}>Hoạt động</option>
            <option value={0}>Không hoạt động</option>
          </select>
        </div>

        <div className={styles['form-actions']}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : (editingId ? 'Cập nhật' : 'Thêm mới')}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} disabled={isLoading}>
              Hủy
            </button>
          )}
        </div>
      </form>

      {message && (
        <p className={`${styles.message} ${isError ? styles.error : ''}`}>
          {message}
        </p>
      )}

      {/* Display schedule table */}
      <div className={styles['schedule-table-container']}>
        <h3>Lịch làm việc {filterDate ? `(${formatDate(filterDate)})` : ''}</h3>
        {isLoading ? (
          <p className={styles['loading']}>Đang tải dữ liệu...</p>
        ) : (
          <table className={styles['schedule-table']}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nhân viên</th>
                <th>Ngày làm việc</th>
                <th>Giờ bắt đầu</th>
                <th>Giờ kết thúc</th>
                <th>Trạng thái</th>
                <th>Ghi chú</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan="8" className={styles['no-data']}>Không có lịch làm việc nào</td>
                </tr>
              ) : (
                schedules.map(schedule => (
                  <tr key={schedule.MALICH}>
                    <td>{schedule.MALICH}</td>
                    <td>{schedule.TENNHANVIEN || 'N/A'}</td>
                    <td>{formatDate(schedule.NGAYLAM)}</td>
                    <td>{formatTimeFromDateTime(schedule.THOIGIANBATDAU)}</td>
                    <td>{formatTimeFromDateTime(schedule.THOIGIANKETTHUC)}</td>
                    <td>{Number(schedule.TRANGTHAI) === 1 ? 'Hoạt động' : 'Không hoạt động'}</td>
                    <td>{schedule.GHICHU || '-'}</td>
                    <td>
                      <button 
                        onClick={() => handleEdit(schedule)}
                        className={styles['edit-btn']}
                        disabled={isLoading}
                      >
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(schedule.MALICH)}
                        className={styles['delete-btn']}
                        disabled={isLoading}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeScheduling;