import axios from 'axios';

// Hàm tự động xác định URL Backend
const getBaseUrl = () => {
  const currentUrl = window.location.origin;
  if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
    return 'http://localhost:8080/api';
  }
  if (currentUrl.includes('5173')) {
    return currentUrl.replace('5173', '8080') + '/api';
  }
  return 'http://localhost:8080/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;