import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ServiceList from './components/ServiceList/ServiceList';

import AdminServiceList from './components/admin/ServiceList';
import AddService from './components/admin/AddService';
import EditService from './components/admin/EditService';
import AdminDashboard from './components/admin/AdminDashboard';
import BookingManager from './components/admin/BookingManager';
import EmployeeScheduling from './components/admin/EmployeeScheduling';

import Booking from './components/Booking/Booking';
import Rating from './components/Rating/Rating';
import Payment from './components/Payment/Payment';
import Employees from './components/Employee/EmployeeList';

import AboutSpa from './components/AboutSpa/AboutSpa'; // Trang giới thiệu spa
import FaqSection from './components/Faq/FaqSection';

import ServiceDetail from './components/ServiceDetail/ServiceDetail'; 
import EmployeeRatingDetails from './components/Employee/EmployeeRatingDetails';

import ForgotPassword from './components/Login/ForgotPassword';
import ResetPassword from './components/Login/ResetPassword';

import Profile from './components/Profile/Profile';
function App() {
  const token = localStorage.getItem('token');
  let isAdmin = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      isAdmin = decodedToken.role === 'admin';
    } catch (error) {
      console.error('Token không hợp lệ:', error);
    }
  }

  return (
    <Router>
      <Layout>
        <Routes>
          {/* --- Dành cho tất cả người dùng --- */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutSpa />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<ServiceList />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/faq" element={<FaqSection />} />
          <Route path="/service-detail/:id" element={<ServiceDetail />} />
          <Route path="/employee-ratings/:empId" element={<EmployeeRatingDetails />} /> 
          <Route path="/profile" element={<Profile />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* --- Dành riêng cho Admin --- */}
          {isAdmin ? (
            <>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/services" element={<AdminServiceList />} />
              <Route path="/admin/services/add" element={<AddService />} />
              <Route path="/admin/services/edit/:id" element={<EditService />} />
              <Route path="/admin/bookings" element={<BookingManager />} />
              <Route path="/admin/employee-scheduling" element={<EmployeeScheduling />} />
            </>
          ) : (
            <Route path="/admin/*" element={<Navigate to="/" />} />
          )}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
