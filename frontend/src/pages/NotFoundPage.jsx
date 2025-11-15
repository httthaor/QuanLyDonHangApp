import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold">404</h1>
      <p>Trang không tìm thấy.</p>
      <Link to="/" className="text-orange-500 hover:underline mt-4 inline-block">Về Trang Chủ</Link>
    </div>
  );
}
export default NotFoundPage;