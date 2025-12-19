// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Import "người gác cổng" (cần cả 2)
const { protect, admin } = require('../middleware/authMiddleware');

// === Route cho Customer (Cần đăng nhập) ===

// POST /api/orders -> Tạo đơn hàng mới (Checkout)
router.post('/', protect, orderController.createOrder);

// GET /api/orders/my-orders -> Lấy lịch sử đơn hàng của user
router.get('/my-orders', protect, orderController.getMyOrders);


// === Route cho Admin (Cần đăng nhập VÀ quyền Admin) ===

// PUT /api/orders/:id/status -> Cập nhật trạng thái đơn hàng
router.put('/:id/status', protect, admin, orderController.updateOrderStatus);


module.exports = router;