import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// Import Layout và các trang
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import SearchPage from './pages/SearchPage'; // <-- IMPORT TRANG MỚI

// Layout chung
function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}

// App chính
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Trang công khai */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="search" element={<SearchPage />} /> {/* <-- THÊM ROUTE MỚI */}
        
        {/* Trang cần đăng nhập */}
        <Route path="cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="profile/edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;