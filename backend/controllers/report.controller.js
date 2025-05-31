const { poolPromise, sql } = require('../config/db');
exports.getSummaryReport = async (req, res) => {
  try {
    const pool = await poolPromise;

    // Tổng doanh thu tính tổng SOTIEN trong THANHTOAN (không lọc theo trạng thái)
    const revenueResult = await pool.request()
      .query(`SELECT ISNULL(SUM(SOTIEN), 0) AS totalRevenue FROM THANHTOAN`);

    // Tổng số khách hàng (đếm số khách khác biệt trong bảng LICHDAT)
    const customersResult = await pool.request()
      .query(`SELECT COUNT(DISTINCT MAKH) AS totalCustomers FROM LICHDAT`);

    // Tổng số lượt đặt lịch
    const bookingsResult = await pool.request()
      .query(`SELECT COUNT(*) AS totalBookings FROM LICHDAT`);

    const totalRevenue = revenueResult.recordset[0].totalRevenue || 0;
    const totalCustomers = customersResult.recordset[0].totalCustomers || 0;
    const totalBookings = bookingsResult.recordset[0].totalBookings || 0;

    return res.json({
      totalRevenue,
      totalCustomers,
      totalBookings,
    });
  } catch (error) {
    console.error('Error fetching summary report:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



//theo tháng

exports.getMonthlyRevenueReport = async (req, res) => {
  try {
    const pool = await poolPromise;

    const query = `
      SELECT 
        MONTH(SWITCHOFFSET(NGAYTHANHTOAN, '+07:00')) AS month,
        ISNULL(SUM(SOTIEN), 0) AS revenue
      FROM THANHTOAN
      WHERE YEAR(SWITCHOFFSET(NGAYTHANHTOAN, '+07:00')) = YEAR(GETDATE())
      GROUP BY MONTH(SWITCHOFFSET(NGAYTHANHTOAN, '+07:00'))
      ORDER BY month
    `;

    const result = await pool.request().query(query);

    return res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching monthly revenue report:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};