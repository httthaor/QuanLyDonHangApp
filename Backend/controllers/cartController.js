// controllers/cartController.js

const db = require('../config/db');

// ================================
// LẤY GIỎ HÀNG (Hiển thị + Tính tổng tiền)
// GET /api/cart
// ================================
exports.getCart = async (req, res) => {
  try {
    // Lấy user id từ middleware 'protect'
    const customerId = req.user.customer_id;

    // Câu SQL JOIN 2 bảng Cart và Products
    const sql = `
      SELECT 
        c.product_id,
        p.product_name,
        p.price,
        p.image_url,
        c.quantity
      FROM Cart c
      JOIN Products p ON c.product_id = p.product_id
      WHERE c.customer_id = ?
    `;

    const [items] = await db.query(sql, [customerId]);

    // Tính tổng tiền
    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    res.status(200).json({
      cartItems: items,
      totalAmount: totalAmount
    });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ================================
// THÊM/CẬP NHẬT GIỎ HÀNG (Logic UPSERT)
// POST /api/cart
// ================================
exports.addItemToCart = async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ message: 'Thiếu product_id hoặc quantity.' });
    }

    // 1. Kiểm tra xem sản phẩm đã tồn tại trong giỏ của user này chưa
    const checkSql = 'SELECT * FROM Cart WHERE customer_id = ? AND product_id = ?';
    const [existingItems] = await db.query(checkSql, [customerId, product_id]);

    if (existingItems.length > 0) {
      // 2. Nếu ĐÃ CÓ: Cập nhật (UPDATE) số lượng
      const newQuantity = existingItems[0].quantity + parseInt(quantity, 10);
      const updateSql = 'UPDATE Cart SET quantity = ? WHERE customer_id = ? AND product_id = ?';
      await db.query(updateSql, [newQuantity, customerId, product_id]);
    } else {
      // 3. Nếu CHƯA CÓ: Thêm mới (INSERT)
      const insertSql = 'INSERT INTO Cart (customer_id, product_id, quantity, date_added) VALUES (?, ?, ?, NOW())';
      await db.query(insertSql, [customerId, product_id, quantity]);
    }

    res.status(201).json({ message: 'Đã thêm/cập nhật sản phẩm vào giỏ hàng.' });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// ================================
// XÓA SẢN PHẨM KHỎI GIỎ HÀNG
// DELETE /api/cart/:productId
// ================================
exports.removeItemFromCart = async (req, res) => {
  try {
    const customerId = req.user.customer_id;
    const { productId } = req.params; // Lấy từ URL

    const sql = 'DELETE FROM Cart WHERE customer_id = ? AND product_id = ?';
    const [result] = await db.query(sql, [customerId, productId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng.' });
    }

    res.status(200).json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng.' });

  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};