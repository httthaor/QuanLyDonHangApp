import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function CheckoutPage() {
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showQrModal, setShowQrModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // === TỰ ĐỘNG ĐIỀN ĐỊA CHỈ ===
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const response = await api.get('/auth/profile');
        if (response.data.shipping_address) {
          setShippingAddress(response.data.shipping_address);
        }
      } catch (err) {
        console.error("Không thể tải địa chỉ mặc định", err);
      }
    };
    fetchDefaultAddress();
  }, []); // Tải 1 lần khi trang mở

  // Hàm gọi API đặt hàng
  const confirmOrder = async () => {
    if (!shippingAddress) {
      alert('Vui lòng nhập địa chỉ giao hàng.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/orders', {
          shipping_address: shippingAddress,
          payment_method: paymentMethod
      });
      alert(`Đặt hàng thành công! Mã đơn hàng của bạn là: ${response.data.orderId}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
      setShowQrModal(false);
    }
  };

  // Xử lý nút "Xác Nhận Đặt Hàng"
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'COD') {
      await confirmOrder(); // COD: Gọi API ngay
    } else if (paymentMethod === 'E_WALLET') {
      setShowQrModal(true); // Ví: Mở Modal QR
    }
  };

  return (
    <>
      <div className="flex justify-center items-center py-10">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Thanh Toán Đơn Hàng</h2>
          <form onSubmit={handleSubmit}>
            <p className="text-center text-gray-600 mb-6">Tài khoản: {user.email}</p>

            {/* === Ô ĐỊA CHỈ (ĐÃ TỰ ĐỘNG ĐIỀN) === */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
              <input 
                type="text"
                value={shippingAddress} // Tự động điền
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
              />
            </div>

            {/* ... (Phần chọn COD/Ví giữ nguyên) ... */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Phương thức thanh toán</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input type="radio" id="cod" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-orange-600 border-gray-300" />
                  <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">Thanh toán khi nhận hàng (COD)</label>
                </div>
                <div className="flex items-center">
                  <input type="radio" id="ewallet" name="paymentMethod" value="E_WALLET" checked={paymentMethod === 'E_WALLET'} onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-orange-600 border-gray-300" />
                  <label htmlFor="ewallet" className="ml-3 block text-sm font-medium text-gray-700">Ví điện tử (Mô phỏng)</label>
                </div>
              </div>
            </div>

            <button type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng'}
            </button>
          </form>
        </div>
      </div>

      {/* === MODAL MÃ QR (Giữ nguyên) === */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
            <h3 className="text-lg font-medium mb-4">Quét Mã Để Thanh Toán</h3>
            <p className="text-sm text-gray-600 mb-4">
              Vui lòng quét mã QR bằng Ví điện tử của bạn. (Đây là mô phỏng).
            </p>
            {/* === MÃ QR SẼ THAY Ở ĐÂY (Xem Bước 3) === */}
            <img 
              src="/qr-code.png" // <--- SỬA LẠI THÀNH DÒNG NÀY
              alt="Quét mã QR để thanh toán (Mô phỏng)"
              className="mx-auto my-4 w-64 h-64" // Thêm kích thước cho chắc
            />
            <button
              onClick={confirmOrder}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Đang xác nhận...' : 'Tôi Đã Thanh Toán'}
            </button>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full mt-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </>
  );
}
export default CheckoutPage;