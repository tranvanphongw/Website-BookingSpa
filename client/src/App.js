import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { UserProvider, UserContext } from './components/contexts/UserContext';

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
import AdminPayments from './components/admin/AdminPayments'; // Import component mới
import GoiDichVuManager from './components/admin/GoiDichVuManager';

import Report from './components/admin/Report';

import Booking from './components/Booking/Booking';
import Rating from './components/Rating/Rating';
import Payment from './components/Payment/Payment';
import Employees from './components/Employee/EmployeeList';

import AboutSpa from './components/AboutSpa/AboutSpa';
import FaqSection from './components/Faq/FaqSection';

import ServiceDetail from './components/ServiceDetail/ServiceDetail';
import EmployeeRatingDetails from './components/Employee/EmployeeRatingDetails';

import ForgotPassword from './components/Login/ForgotPassword';
import ResetPassword from './components/Login/ResetPassword';

import Profile from './components/Profile/Profile';



// Tách phần routes ra thành component riêng để dùng context
function AppRoutes() {
  const { user } = useContext(UserContext);
  const isAdmin = user?.role === 'admin';

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
              <Route path="/admin/payments" element={<AdminPayments />} /> {/* Thêm route quản lý thanh toán */}
              <Route path="/admin/packages" element={<GoiDichVuManager />} />

              <Route path="/report" element={<Report />} />

            </>
          ) : (
            <Route path="/admin/*" element={<Navigate to="/" />} />
          )}
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App;
