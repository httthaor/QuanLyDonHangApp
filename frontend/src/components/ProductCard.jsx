import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const auth = useAuth();

  const goToDetail = () => {
    navigate(`/product/${product.product_id}`);
  };
  
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!auth.token) {
      alert('Bạn cần đăng nhập để thêm vào giỏ hàng!');
      navigate('/login');
      return;
    }
    
    try {
      await api.post('/cart', {
        product_id: product.product_id,
        quantity: 1
      });
      alert(`Đã thêm ${product.product_name} vào giỏ hàng!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng');
    }
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform duration-300 hover:shadow-md hover:-translate-y-1"
      onClick={goToDetail}
    >
      <div className="w-full h-48 sm:h-56 bg-gray-200 overflow-hidden">
        <img 
          src={product.image_url || 'https://placehold.co/400x400/CCCCCC/B0B0B0?text=No+Image'} 
          alt={product.product_name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-800 truncate" title={product.product_name}>
          {product.product_name}
        </h3>
        <p className="mt-2 text-lg font-bold text-orange-600">
          {auth.formatCurrency(product.price)}
        </p>
        <button 
          onClick={handleAddToCart}
          className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors hover:bg-orange-600"
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
export default ProductCard;