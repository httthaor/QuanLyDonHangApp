import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx'; // Sửa lỗi import (nếu cần)
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.register({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        date_of_birth: dateOfBirth
      });
      // AuthContext sẽ tự động điều hướng
    } catch (error) {
      // AuthContext đã alert lỗi
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng Ký Tài Khoản</h2>
        
        <form onSubmit={handleSubmit}>
          {/* === BỐ CỤC MỚI THEO YÊÊU CẦU === */}
          
          {/* 1. Tên và Họ */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên</label>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ</label>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
              />
            </div>
          </div>

          {/* 2. Ngày sinh */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
            <input 
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
            />
          </div>

          {/* 3. Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
            />
          </div>

          {/* 4. Mật khẩu */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
            />
          </div>
          {/* ================================== */}

          <button type="submit"
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-orange-700 transition-colors"
          >
            Tạo Tài Khoản
          </button>
        </form>
      </div>
    </div>
  );
}
export default RegisterPage;