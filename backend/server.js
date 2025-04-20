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

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

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
    app.use('/api/payments', paymentRoutes);
    app.use('/api/employees', employeeRoutes);

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
