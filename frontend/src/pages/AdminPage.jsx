import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, formatCurrency } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      alert('Bạn không có quyền truy cập trang này!');
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, navigate]);

  if (loading) return <div className="text-center p-10 text-blue-600">Đang tải dữ liệu báo cáo...</div>;
  
  if (error) return (
    <div className="text-center p-20">
      <h2 className="text-2xl font-bold text-red-600">KHÔNG TẢI ĐƯỢC BÁO CÁO</h2>
      <p className="text-gray-700 mt-4 text-lg">Lỗi: {error}</p>
      <p className="text-sm text-gray-500 mt-2">Hãy kiểm tra lại Terminal Backend xem đã chạy chưa.</p>
      <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">Quay về trang chủ</Link>
    </div>
  );

  if (!stats) return <div className="text-center p-10">Không có dữ liệu thống kê.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Báo Cáo Doanh Số & Đơn Hàng</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm uppercase font-bold">Tổng Doanh Thu</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{formatCurrency(stats.revenue || 0)}</p>
          <p className="text-sm text-gray-400 mt-1">Doanh thu ước tính (trừ đơn hủy)</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm uppercase font-bold">Tổng Đơn Hàng</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.orders || 0} Đơn</p>
          <p className="text-sm text-gray-400 mt-1">Tổng số đơn hàng toàn hệ thống</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Tình Trạng Đơn Hàng</h2>
        <div className="space-y-4">
          {stats.statusBreakdown && stats.statusBreakdown.length > 0 ? (
            stats.statusBreakdown.map((item) => {
              const percent = stats.orders > 0 ? Math.round((item.count / stats.orders) * 100) : 0;
              let colorClass = 'bg-gray-400';
              
              if (item.order_status === 'Completed') colorClass = 'bg-green-500';
              else if (item.order_status === 'Pending') colorClass = 'bg-yellow-400';
              else if (item.order_status === 'Shipping') colorClass = 'bg-blue-400';
              else if (item.order_status === 'Cancelled') colorClass = 'bg-red-400';

              return (
                <div key={item.order_status}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.order_status}</span>
                    <span className="text-sm font-medium text-gray-700">{item.count} đơn ({percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className={`${colorClass} h-4 rounded-full`} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500">Chưa có đơn hàng nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;