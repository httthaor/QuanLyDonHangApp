import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const auth = useAuth();
  const [searchTerm, setSearchTerm] = useState(''); // State để lưu nội dung ô tìm kiếm
  const navigate = useNavigate(); // Hook để điều hướng

  // Hàm xử lý khi submit form tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault(); // Ngăn trang tải lại
    if (searchTerm.trim()) {
      // Điều hướng đến trang kết quả tìm kiếm
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm(''); // Xóa nội dung ô tìm kiếm
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-orange-600">
            App Quản Lý Đơn Hàng
          </Link>
          
          {/* === THANH TÌM KIẾM MỚI === */}
          <form onSubmit={handleSearch} className="flex-1 hidden sm:flex justify-center px-8">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="bg-orange-600 text-white px-4 rounded-r-lg hover:bg-orange-700"
            >
              Tìm
            </button>
          </form>
          {/* ========================== */}

          <div className="flex items-center space-x-4">
            {/* ... (Code Link Giỏ hàng, Đăng nhập, Đăng xuất giữ nguyên) ... */}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-orange-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>
            {auth.token ? (
              <>
                <Link to="/my-orders" className="text-sm font-medium text-gray-700 hover:text-orange-600">
                  Đơn Hàng
                </Link>
                <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-orange-600">
                  Chào, {auth.user?.email}
                </Link>
                <button onClick={auth.logout} className="text-sm font-medium text-gray-700 hover:text-orange-600">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-orange-600">
                  Đăng nhập
                </Link>
                <Link to="/register" className="text-sm font-medium text-gray-700 hover:text-orange-600">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
export default Header;