const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route lấy thống kê (Chỉ Admin mới truy cập được)
router.get('/stats', protect, admin, adminController.getStats);

module.exports = router;