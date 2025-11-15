// routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Import "người gác cổng"
const { protect } = require('../middleware/authMiddleware');

// =CAM KẾT: Cả 3 API này đều phải chạy qua 'protect' (bắt buộc đăng nhập)

// 1. GET /api/cart -> Xem giỏ hàng
router.get('/', protect, cartController.getCart);

// 2. POST /api/cart -> Thêm/cập nhật sản phẩm
router.post('/', protect, cartController.addItemToCart);

// 3. DELETE /api/cart/:productId -> Xóa 1 sản phẩm
router.delete('/:productId', protect, cartController.removeItemFromCart);


module.exports = router;