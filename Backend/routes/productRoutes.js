// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Import "người gác cổng"
const { protect, admin } = require('../middleware/authMiddleware');

// ================================
// ROUTE CÔNG KHAI (Public - Ai cũng xem được)
// ================================

// (Hiển thị danh mục)
router.get('/categories', productController.getCategories); 

// (Tìm kiếm, Lấy tất cả sản phẩm)
router.get('/', productController.getProducts);

// (Xem chi tiết 1 sản phẩm)
router.get('/:id', productController.getProductById);

// ================================
// ROUTE CỦA ADMIN (Protected)
// ================================

// (Thêm sản phẩm) - Cần [Đăng nhập] VÀ [Là Admin]
router.post('/', protect, admin, productController.createProduct);

// (Sửa sản phẩm) - Cần [Đăng nhập] VÀ [Là Admin]
router.put('/:id', protect, admin, productController.updateProduct);

// (Xóa sản phẩm) - Cần [Đăng nhập] VÀ [Là Admin]
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;