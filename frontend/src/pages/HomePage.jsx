import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // State mới cho danh mục
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi 2 API cùng lúc
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),          // Lấy sản phẩm
          api.get('/products/categories') // Lấy danh mục
        ]);
        
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-10">Đang tải...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Lỗi: {error}</div>;

  return (
    <div>
      {/* === PHẦN DANH MỤC MỚI === */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Danh Mục Sản Phẩm</h2>
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map(cat => (
          <Link
            key={cat.category_id}
            to={`/search?category=${cat.category_id}`} // Link đến trang kết quả
            className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-orange-50 hover:border-orange-500"
          >
            {cat.category_name}
          </Link>
        ))}
      </div>
      {/* ========================== */}

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Sản phẩm nổi bật</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {products.map(product => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
}
export default HomePage;