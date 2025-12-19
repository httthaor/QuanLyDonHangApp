// controllers/orderController.js

const db = require('../config/db');

// TẠO ĐƠN HÀNG MỚI (CHECKOUT)
exports.createOrder = async (req, res) => {
  // Bắt đầu một kết nối riêng để dùng Transaction
  let connection;
  try {
    connection = await db.getConnection(); // Lấy 1 kết nối từ pool
    await connection.beginTransaction(); // Bắt đầu Transaction

    // 1. Lấy thông tin cơ bản
    const customerId = req.user.customer_id;
    const { shipping_address, payment_method } = req.body;

    if (!shipping_address || !payment_method) {
      return res.status(400).json({ message: 'Thiếu địa chỉ giao hàng hoặc phương thức thanh toán.' });
    }

    // 2. Lấy giỏ hàng của user (Khóa các dòng này lại (FOR UPDATE) để đảm bảo không ai sửa kho)
    const cartSql = `
      SELECT 
        c.product_id, c.quantity, 
        p.price, p.stock_quantity
      FROM Cart c
      JOIN Products p ON c.product_id = p.product_id
      WHERE c.customer_id = ?
      FOR UPDATE 
    `;
    const [cartItems] = await connection.query(cartSql, [customerId]);

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống, không thể checkout.' });
    }

    // 3. Tính tổng tiền VÀ Kiểm tra kho
    let totalAmount = 0;
    for (const item of cartItems) {
      if (item.quantity > item.stock_quantity) {
        // Nếu 1 sản phẩm không đủ hàng -> Hủy toàn bộ
        throw new Error(`Sản phẩm "${item.product_id}" không đủ số lượng (chỉ còn ${item.stock_quantity})`);
      }
      totalAmount += item.price * item.quantity;
    }

    // 4. TẠO ĐƠN HÀNG (Bảng `Orders`)
    const orderSql = `
      INSERT INTO Orders (customer_id, order_date, total_amount, order_status, shipping_address, billing_address, payment_method)
      VALUES (?, NOW(), ?, 'Pending', ?, ?, ?)
    `;
    // (Giả sử billing_address giống shipping_address cho đơn giản)
    const [orderResult] = await connection.query(orderSql, [customerId, totalAmount, shipping_address, shipping_address, payment_method]);
    const newOrderId = orderResult.insertId; // Lấy ID của đơn hàng vừa tạo

    // 5. CHUYỂN HÀNG TỪ GIỎ SANG CHI TIẾT ĐƠN HÀNG (Bảng `Order_Details`)
    // và 6. CẬP NHẬT KHO (Bảng `Products`)
    for (const item of cartItems) {
      // Thêm vào Order_Details
      const detailSql = 'INSERT INTO Order_Details (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)';
      await connection.query(detailSql, [newOrderId, item.product_id, item.quantity, item.price]);
      
      // Trừ kho Products
      const updateStockSql = 'UPDATE Products SET stock_quantity = stock_quantity - ? WHERE product_id = ?';
      await connection.query(updateStockSql, [item.quantity, item.product_id]);
    }

    // 7. TẠO THANH TOÁN MÔ PHỎNG (Bảng `Payments`)
    const paymentSql = 'INSERT INTO Payments (order_id, payment_method, payment_status, payment_date) VALUES (?, ?, ?, NOW())';
    // Nếu là COD, status là 'Pending'. Nếu là E_WALLET, giả sử là 'Success'
    const paymentStatus = (payment_method === 'COD') ? 'Pending' : 'Success';
    await connection.query(paymentSql, [newOrderId, payment_method, paymentStatus]);

    // 8. XÓA GIỎ HÀNG (Bảng `Cart`)
    const deleteCartSql = 'DELETE FROM Cart WHERE customer_id = ?';
    await connection.query(deleteCartSql, [customerId]);
    
    // 9. Nếu TẤT CẢ thành công: Commit Transaction
    await connection.commit();
    
    res.status(201).json({ message: 'Đặt hàng thành công!', orderId: newOrderId });

  } catch (error) {
    // 10. Nếu có BẤT KỲ lỗi nào: Rollback Transaction
    if (connection) await connection.rollback();
    res.status(500).json({ message: 'Đặt hàng thất bại!', error: error.message });
  } finally {
    // 11. Luôn luôn trả kết nối về pool
    if (connection) connection.release();
  }
};

// LẤY LỊCH SỬ ĐƠN HÀNG CỦA TÔI
exports.getMyOrders = async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const [orders] = await db.query('SELECT * FROM Orders WHERE customer_id = ? ORDER BY order_date DESC', [customerId]);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// (ADMIN) CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Processing', 'Shipping', 'Completed', 'Cancelled'

    if (!status) {
      return res.status(400).json({ message: 'Thiếu trạng thái (status).' });
    }

    const sql = "UPDATE Orders SET order_status = ? WHERE order_id = ?";
    const [result] = await db.query(sql, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    }
    res.status(200).json({ message: `Cập nhật trạng thái đơn hàng #${id} thành công.` });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};