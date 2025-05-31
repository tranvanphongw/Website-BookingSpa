require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { poolPromise } = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const serviceRoutes = require('./routes/service.routes');
const bookingRoutes = require('./routes/booking.routes');
const ratingRoutes = require('./routes/rating.routes');
const paymentRoutes = require('./routes/payment.routes');
const employeeRoutes = require('./routes/employee.routes');
const khachhangRoutes = require('./routes/khachhang.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const packageRoutes = require('./routes/package.routes');
const goiDichVuRoutes = require('./routes/goiDichVu.routes');

const reportRoutes = require('./routes/report.routes');

const forgotRoutes = require('./routes/forgot.routes');

const path = require('path');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/images', express.static('public/images'));

// Kiểm tra kết nối cơ sở dữ liệu trước khi khởi động server
poolPromise
  .then(() => {
    // Nếu kết nối thành công, khởi động server
    console.log("Kết nối cơ sở dữ liệu thành công. Khởi động server...");

    // Route usage
    app.use('/api/auth', authRoutes);
    app.use('/api/services', serviceRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/ratings', ratingRoutes);
    app.use('/api/payment', paymentRoutes);
    app.use('/api/employees', employeeRoutes);
    app.use('/api/khachhang', khachhangRoutes);
    app.use('/api/schedules', scheduleRoutes);
    app.use('/api/packages', packageRoutes);
    app.use('/api/auth', forgotRoutes);
    app.use('/api/goidichvu', goiDichVuRoutes);

    app.use('/api/report', reportRoutes);

    app.get('/', (req, res) => {
      res.send('Spa Booking API is running...');
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Không thể kết nối đến cơ sở dữ liệu. Dừng server.", err);
    process.exit(1); // Dừng server nếu không thể kết nối cơ sở dữ liệu
  });
