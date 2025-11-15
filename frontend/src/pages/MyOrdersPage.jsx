import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatCurrency } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders/my-orders');
        setOrders(response.data);
      } catch (err) {
        setError(err.message || 'Không thể tải đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Hàm style cho status
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipping':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center p-10">Đang tải đơn hàng...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Lỗi: {error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Đơn Hàng Của Tôi</h1>
      {orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào. <Link to="/" className="text-orange-600">Bắt đầu mua sắm</Link></p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {orders.map(order => (
              <li key={order.order_id} className="p-4 sm:p-6 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">Mã Đơn Hàng: #{order.order_id}</p>
                    <p className="text-sm text-gray-500">
                      Ngày đặt: {new Date(order.order_date).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-sm text-gray-500">Địa chỉ: {order.shipping_address}</p>
                  </div>
                  <div className="text-left sm:text-right mt-4 sm:mt-0">
                    <p className="text-lg font-bold text-orange-600">{formatCurrency(order.total_amount)}</p>
                    <p className="mt-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default MyOrdersPage;