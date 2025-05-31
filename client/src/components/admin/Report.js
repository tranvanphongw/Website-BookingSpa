import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Đăng ký các thành phần cần thiết cho ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Component biểu đồ doanh thu
const RevenueChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Doanh thu theo tháng' },
    },
  };

  return <Bar options={options} data={data} />;
};

export default function Report() {
  const [report, setReport] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        // Lấy tổng quan
        const resSummary = await axios.get('http://localhost:5000/api/report/summary');
        setReport(resSummary.data);

        // Lấy dữ liệu doanh thu theo tháng
        const resMonthly = await axios.get('http://localhost:5000/api/report/monthly-revenue');
        const apiData = resMonthly.data;

        // Chuẩn bị dữ liệu cho biểu đồ
        const labels = apiData.map(item => `Tháng ${item.month}`);
        const dataPoints = apiData.map(item => item.revenue);
        setMonthlyRevenue({
          labels,
          datasets: [{
            label: 'Doanh thu (VND)',
            data: dataPoints,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          }],
        });
      } catch (err) {
        console.error('Fetch report failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <div>Đang tải báo cáo...</div>;
  if (!report) return <div>Không có dữ liệu báo cáo</div>;

  return (
    <div className="container my-4">
      <h1 className="mb-4">Báo cáo tổng quan Spa</h1>
      <div className="row">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Tổng doanh thu</h5>
              <p className="card-text">{report.totalRevenue.toLocaleString()} VND</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Tổng khách hàng</h5>
              <p className="card-text">{report.totalCustomers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-info mb-3">
            <div className="card-body">
              <h5 className="card-title">Tổng lượt đặt lịch</h5>
              <p className="card-text">{report.totalBookings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu theo tháng */}
      {monthlyRevenue && (
        <div className="mt-5">
          <RevenueChart data={monthlyRevenue} />
        </div>
      )}
    </div>
  );
}
