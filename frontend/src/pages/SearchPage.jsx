import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

function SearchPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Hook này dùng để đọc URL (ví dụ: ?q=...&category=...)
  const [searchParams] = useSearchParams();
  
  const query = searchParams.get('q');       // Lấy từ khóa tìm kiếm
  const category = searchParams.get('category'); // Lấy ID danh mục

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        // Gọi API với params
        const response = await api.get('/products', {
          params: {
            search: query,   // Gửi 'q' (nếu có)
            category: category // Gửi 'category' (nếu có)
          }
        });
        setProducts(response.data);
      } catch (err) {
        setError(err.message || 'Không thể tải kết quả');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query, category]); // Chạy lại hàm này mỗi khi URL thay đổi

  // Hiển thị tiêu đề
  const getTitle = () => {
    if (query) return `Kết quả tìm kiếm cho: "${query}"`;
    if (category) return `Sản phẩm trong Danh mục`; // (Bạn có thể fetch tên danh mục nếu muốn)
    return 'Tất cả sản phẩm';
  };

  if (loading) return <div className="text-center p-10">Đang tìm kiếm...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Lỗi: {error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{getTitle()}</h1>
      {products.length === 0 ? (
        <p>Không tìm thấy sản phẩm nào phù hợp.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.map(product => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
export default SearchPage;