const db = require('../config/db');

// Lấy thống kê cho Admin Dashboard
exports.getStats = async (req, res) => {
  try {
    // 1. Tính Tổng Doanh Thu (Tính hết các đơn khác Cancelled)
    const [revenueRes] = await db.query(
      "SELECT SUM(total_amount) as total FROM Orders WHERE order_status != 'Cancelled'"
    );
    const totalRevenue = revenueRes[0].total || 0;

    // 2. Đếm Tổng Số Đơn
    const [ordersRes] = await db.query("SELECT COUNT(*) as count FROM Orders");
    const totalOrders = ordersRes[0].count || 0;

    // 3. Đếm số lượng đơn theo từng Trạng thái (để vẽ biểu đồ)
    const [statusRes] = await db.query(
      "SELECT order_status, COUNT(*) as count FROM Orders GROUP BY order_status"
    );

    res.json({
      revenue: totalRevenue,
      orders: totalOrders,
      statusBreakdown: statusRes
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};