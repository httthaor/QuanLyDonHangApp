import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import NotFoundPage from './NotFoundPage'; // Sẽ tạo file này sau

function ProductDetailPage() {
  const { id } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.message || 'Không thể tải sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
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

  if (loading) return <div className="text-center p-10">Đang tải...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Lỗi: {error}</div>;
  if (!product) return <NotFoundPage />;

  return (
    <div>
      <Link to="/" className="mb-6 text-sm font-medium text-orange-600 hover:text-orange-800">
        &larr; Quay lại Trang chủ
      </Link>
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden mt-4">
        <div className="w-full md:w-1/2 bg-gray-200">
          <img 
            src={product.image_url || 'https://placehold.co/600x600/CCCCCC/B0B0B0?text=No+Image'} 
            alt={product.product_name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.product_name}</h1>
            <p className="text-3xl font-bold text-orange-600 mb-6">
              {auth.formatCurrency(product.price)}
            </p>
            <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
              {product.description || "Chưa có mô tả cho sản phẩm này."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-md font-semibold transition-colors hover:bg-orange-600"
            >
              Thêm vào Giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductDetailPage;