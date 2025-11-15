// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const db = require('../config/db');

// 1. NGƯỜI GÁC CỔNG "BẢO VỆ" (Đã có)
// Kiểm tra xem đã đăng nhập chưa
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [users] = await db.query('SELECT customer_id, email, role FROM Customers WHERE customer_id = ?', [decoded.id]);
      
      if (users.length === 0) {
        return res.status(401).json({ message: 'Không tìm thấy người dùng.' });
      }

      req.user = users[0]; // Gắn user vào request
      next(); // Đi tiếp

    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Chưa đăng nhập, không có token.' });
  }
};


// 2. NGƯỜI GÁC CỔNG "ADMIN" (Hàm mới)
// Phải chạy SAU khi chạy 'protect'
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // OK, là admin, đi tiếp
  } else {
    res.status(403).json({ message: 'Không có quyền Admin.' }); // 403: Forbidden
  }
};

// Xuất cả 2 hàm ra
module.exports = { protect, admin };