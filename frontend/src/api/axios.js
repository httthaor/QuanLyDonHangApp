import axios from 'axios';

// Hàm để tự chọn Base URL
const getBaseUrl = () => {
  const currentUrl = window.location.href; // Lấy địa chỉ hiện tại trên thanh browser
  
  // 1. Nếu đang chạy Localhost
  if (currentUrl.includes('localhost')) {
    return 'http://localhost:8080/api';
  }

  // 2. Nếu đang chạy trên VS Code Port Forwarding 
  if (currentUrl.includes('5173')) {
    return window.location.origin.replace('5173', '8080') + '/api';
  }
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;