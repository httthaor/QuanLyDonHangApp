// routes/auth.js

const express = require('express');
const router = express.Router();

// Import controller
const authController = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
// Định nghĩa route:
// Khi có 1 yêu cầu POST tới /register, nó sẽ gọi hàm 'register'
router.post('/register', authController.register);

// (Sau này thêm route cho login)
// router.post('/login', authController.login);

// Route cho Đăng nhập
router.post('/login', authController.login);

// *** DÒNG MỚI: API ĐỂ LẤY THÔNG TIN PROFILE ***
router.get('/profile', protect, authController.getProfile);

// Route Cập nhật thông tin (Protected)
router.put('/profile', protect, authController.updateProfile);

module.exports = router;

