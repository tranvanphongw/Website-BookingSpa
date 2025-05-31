import React, { useState } from 'react';
import ServiceList from './ServiceList';
import AddService from './AddService';
import EditService from './EditService';
import EmployeeList from './EmployeeList';
import BookingManager from './BookingManager';
import EmployeeScheduling from './EmployeeScheduling';
import AdminPayments from './AdminPayments';
import GoiDichVuManager from './GoiDichVuManager';
import Report from './Report';  // Import component mới
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('serviceList');

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <h3 className="sidebar-title">Quản lý Spa</h3>
        <ul className="sidebar-list">
          <li
            className={selectedTab === 'serviceList' ? 'active' : ''}
            onClick={() => setSelectedTab('serviceList')}
          >
            Quản Lý dịch vụ
          </li>
          <li
            className={selectedTab === 'packageManager' ? 'active' : ''}
            onClick={() => setSelectedTab('packageManager')}
          >
            Quản lý gói dịch vụ
          </li>
          <li
            className={selectedTab === 'listEmployees' ? 'active' : ''}
            onClick={() => setSelectedTab('listEmployees')}
          >
            Quản lý nhân viên
          </li>
          <li
            className={selectedTab === 'emPloyeeScheduling' ? 'active' : ''}
            onClick={() => setSelectedTab('emPloyeeScheduling')}
          >
            Quản lý lịch làm việc
          </li>
          <li
            className={selectedTab === 'listBookings' ? 'active' : ''}
            onClick={() => setSelectedTab('listBookings')}
          >
            Quản lý đặt lịch
          </li>
          <li
            className={selectedTab === 'payments' ? 'active' : ''}
            onClick={() => setSelectedTab('payments')}
          >
            Quản lý thanh toán
          </li>
          <li
            className={selectedTab === 'report' ? 'active' : ''}
            onClick={() => setSelectedTab('report')}
          >
            Báo cáo
          </li>
        </ul>
      </div>

      <div className="content">
        {selectedTab === 'serviceList' && <ServiceList />}
        {selectedTab === 'addService' && <AddService />}
        {selectedTab === 'editService' && <EditService />}
        {selectedTab === 'listEmployees' && <EmployeeList />}
        {selectedTab === 'listBookings' && <BookingManager />}
        {selectedTab === 'emPloyeeScheduling' && <EmployeeScheduling />}
        {selectedTab === 'payments' && <AdminPayments />}
        {selectedTab === 'packageManager' && <GoiDichVuManager />}
        {selectedTab === 'report' && <Report />} {/* Tab báo cáo */}
      </div>
    </div>
  );
};

export default AdminDashboard;
