import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function CartPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm tải giỏ hàng
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (err) {
      setError(err.message || 'Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []); // Tải giỏ hàng khi trang mở

  // Hàm Xóa Sản Phẩm
  const handleRemoveItem = async (productId) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await api.delete(`/cart/${productId}`);
      alert('Đã xóa sản phẩm.');
      fetchCart(); // Tải lại giỏ hàng
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa sản phẩm');
    }
  };

  // Hàm Checkout (ĐÃ SỬA LỖI)
  // Nút này chỉ cần chuyển người dùng đến trang Checkout
  // Nơi họ sẽ điền địa chỉ và chọn thanh toán.
  const handleCheckout = () => {
    navigate('/checkout');
  };

  // === Render ===
  if (loading) return <div className="text-center p-10">Đang tải giỏ hàng...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Lỗi: {error}</div>;
  if (!cart) return null;

  const { cartItems, totalAmount } = cart;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Giỏ Hàng Của Bạn</h1>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống. <Link to="/" className="text-orange-600">Tiếp tục mua sắm</Link></p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Danh sách sản phẩm */}
          <div className="flex-1">
            <ul className="-my-6 divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.product_id} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img src={item.image_url || 'https://placehold.co/100x100/CCCCCC/B0B0B0?text=No+Image'} alt={item.product_name} className="h-full w-full object-cover object-center" />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.product_name}</h3>
                        <p className="ml-4">{auth.formatCurrency(item.price * item.quantity)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">Giá: {auth.formatCurrency(item.price)}</p>
                      <button 
                        onClick={() => handleRemoveItem(item.product_id)}
                        type="button" 
                        className="font-medium text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Tóm tắt đơn hàng */}
          <div className="lg:w-1D/3">
            <div className="border border-gray-200 rounded-lg shadow-sm bg-white p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Tổng tiền</p>
                <p>{auth.formatCurrency(totalAmount)}</p>
              </div>
              <p className="text-sm text-gray-500 mb-6">Phí vận chuyển sẽ được tính ở bước thanh toán.</p>
              <button 
                onClick={handleCheckout}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-md font-semibold text-lg transition-colors hover:bg-orange-700"
              >
                Tiến hành Thanh Toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default CartPage;