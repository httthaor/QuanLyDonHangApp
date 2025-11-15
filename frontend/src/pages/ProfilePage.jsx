import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/auth/profile');
        setProfile(response.data);
      } catch (err) {
        setError(err.message || 'Lỗi tải thông tin');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []); // Tải khi trang mở

  if (loading) return <div className="text-center p-10">Đang tải hồ sơ...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Lỗi: {error}</div>;
  if (!profile) return null;

  // Hàm format ngày sinh
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  }

  return (
    <div className="flex justify-center items-center py-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Thông Tin Tài Khoản</h2>
        
        {/* Đây là phần HIỂN THỊ */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Họ và Tên:</span>
            <span className="text-gray-900">{profile.first_name} {profile.last_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Email:</span>
            <span className="text-gray-900">{profile.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Ngày sinh:</span>
            <span className="text-gray-900">{formatDate(profile.date_of_birth)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Số điện thoại:</span>
            <span className="text-gray-900">{profile.phone_number || 'Chưa cập nhật'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Địa chỉ mặc định:</span>
            <span className="text-gray-900">{profile.shipping_address || 'Chưa cập nhật'}</span>
          </div>
        </div>

        {/* Nút Cập Nhật */}
        <div className="mt-8 text-center">
          <Link 
            to="/profile/edit" // Dẫn đến trang CHỈNH SỬA
            className="w-full sm:w-auto bg-orange-600 text-white py-2 px-6 rounded-md font-semibold hover:bg-orange-700 transition-colors"
          >
            Cập Nhật Thông Tin
          </Link>
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;