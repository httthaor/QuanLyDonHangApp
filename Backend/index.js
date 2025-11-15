// index.js

// ================================
// 1. IMPORT CÁC THƯ VIỆN
// ================================
require('dotenv').config(); // Phải gọi đầu tiên
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Import DB (CHỈ MỘT LẦN)
const authRoutes = require('./routes/auth'); // Import file routes/auth.js
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// ================================
// 2. KHỞI TẠO APP
// ================================
const app = express();
const PORT = process.env.PORT || 8080;

// ================================
// 3. SỬ DỤNG MIDDLEWARE
// ================================
app.use(cors());
app.use(express.json());

// ================================
// 4. ĐỊNH NGHĨA CÁC API ROUTES
// ================================

// Route chính
app.get('/', (req, res) => {
  res.send('Chào mừng đến với Backend API E-commerce!');
});

// Route kiểm tra kết nối DB
app.get('/api/test_db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.json({
      message: 'Kết nối Database thành công!',
      solution: rows[0].solution,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Kết nối Database THẤT BẠI!',
      error: error.message,
    });
  }
});

// Route kiểm tra file .env
app.get('/api/check_env', (req, res) => {
  res.json({
    DB_USER_FROM_ENV: process.env.DB_USER,
    DB_HOST_FROM_ENV: process.env.DB_HOST,
    DB_NAME_FROM_ENV: process.env.DB_NAME,
    DB_PASSWORD_IS_SET: process.env.DB_PASSWORD ? "CÓ" : "KHÔNG (RỖNG)"
  });
});

// Route cho Đăng ký / Đăng nhập (từ file routes/auth.js)
app.use('/api/auth', authRoutes);
// *** DÒNG MỚI 2: Sử dụng product routes ***
app.use('/api/products', productRoutes);
// *** DÒNG MỚI 2: Sử dụng cart routes ***
app.use('/api/cart', cartRoutes);
// *** DÒNG MỚI 2: Sử dụng order routes ***
app.use('/api/orders', orderRoutes);


// ================================
// 5. KHỞI ĐỘNG SERVER
// ================================
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});