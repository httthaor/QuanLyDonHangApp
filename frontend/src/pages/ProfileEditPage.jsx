import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function ProfileEditPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    shipping_address: '',
    phone_number: '',
    date_of_birth: ''
  });

  // 1. Tải thông tin cũ để điền vào form
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const response = await api.get('/auth/profile');
          const { first_name, last_name, shipping_address, phone_number, date_of_birth } = response.data;
          
          // Format lại ngày sinh (YYYY-MM-DD) cho input type="date"
          const formattedDOB = date_of_birth ? date_of_birth.split('T')[0] : '';
          
          setFormData({
            first_name: first_name || '',
            last_name: last_name || '',
            shipping_address: shipping_address || '',
            phone_number: phone_number || '',
            date_of_birth: formattedDOB
          });
        } catch (err) {
          alert(err.response?.data?.message || 'Lỗi tải thông tin');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Gửi thông tin cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/profile', formData);
      alert('Cập nhật thông tin thành công!');
      navigate('/profile'); // Quay về trang hiển thị thông tin
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi cập nhật');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.first_name) return <div>Đang tải thông tin...</div>;

  return (
    <div className="flex justify-center items-center py-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Cập Nhật Thông Tin</h2>
        <form onSubmit={handleSubmit}>
          {/* ... (Các ô input) ... */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên</label>
              <input 
                type="text" name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ</label>
              <input 
                type="text" name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
            <input 
              type="date" name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Địa chỉ giao hàng</label>
            <input 
              type="text" name="shipping_address"
              value={formData.shipping_address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input 
              type="text" name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
            />
          </div>
          <button type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
        </form>
      </div>
    </div>
  );
}
export default ProfileEditPage;