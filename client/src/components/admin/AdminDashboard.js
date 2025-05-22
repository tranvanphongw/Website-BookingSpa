import React, { useState } from 'react';
import ServiceList from './ServiceList';
import AddService from './AddService';
import EditService from './EditService';
import EmployeeList from './EmployeeList'; // Import danh sách nhân viên
import BookingManager from './BookingManager'; // Import BookingManager component
import './AdminDashboard.css'; // Import CSS file để cải thiện giao diện
import EmployeeScheduling from './EmployeeScheduling';
const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('serviceList'); // Tab mặc định là Service List

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
        </ul>
      </div>

      <div className="content">
        {selectedTab === 'serviceList' && <ServiceList />}
        {selectedTab === 'addService' && <AddService />}
        {selectedTab === 'editService' && <EditService />}
        {selectedTab === 'listEmployees' && <EmployeeList />}
        {selectedTab === 'listBookings' && <BookingManager />}
        {selectedTab === 'emPloyeeScheduling' && <EmployeeScheduling />}
      </div>
    </div>
  );
};

export default AdminDashboard;