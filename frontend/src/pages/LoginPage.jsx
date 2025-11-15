import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await auth.login(email, password);
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" 
            />
          </div>
          <button type="submit"
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-orange-700 transition-colors"
          >
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
}
export default LoginPage;