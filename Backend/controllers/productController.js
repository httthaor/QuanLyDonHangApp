const db = require('../config/db');

// LẤY TẤT CẢ DANH MỤC
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM Categories');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// LẤY TẤT CẢ SẢN PHẨM 
exports.getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let sql = `
      SELECT p.product_id, p.product_name, p.description, p.price, p.stock_quantity, p.image_url, c.category_name 
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.category_id
    `;
    const params = [];
    
    // (Phiên bản không có status)
    let whereClauses = []; 

    // Xử lý điều kiện WHERE
    if (search) {
      whereClauses.push(
        'UPPER(p.product_name) LIKE UPPER(?) COLLATE utf8mb4_bin'
      );
      params.push(`%${search}%`); // Chỉ cần 1 tham số
    }
    if (category) {
      whereClauses.push('p.category_id = ?');
      params.push(category);
    }

    if (whereClauses.length > 0) {
      sql += ' WHERE ' + whereClauses.join(' AND ');
    }

    const [products] = await db.query(sql, params);
    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};


// LẤY 1 SẢN PHẨM
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await db.query(
      `SELECT p.*, c.category_name 
       FROM Products p
       LEFT JOIN Categories c ON p.category_id = c.category_id
       WHERE p.product_id = ?`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }
    res.status(200).json(products[0]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// (ADMIN) THÊM SẢN PHẨM
exports.createProduct = async (req, res) => {
  try {
    const { product_name, description, price, stock_quantity, category_id, image_url } = req.body;

    if (!product_name || !price || !stock_quantity || !category_id) {
      return res.status(400).json({ message: 'Vui lòng điền các trường bắt buộc.' });
    }

    const sql = 'INSERT INTO Products (product_name, description, price, stock_quantity, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [product_name, description, price, stock_quantity, category_id, image_url]);

    res.status(201).json({ message: 'Tạo sản phẩm thành công', productId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// (ADMIN) SỬA SẢN PHẨM
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, description, price, stock_quantity, category_id, image_url } = req.body;

    const [products] = await db.query('SELECT * FROM Products WHERE product_id = ?', [id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }
    const old = products[0];

    const sql = `
      UPDATE Products SET
        product_name = ?, description = ?, price = ?, 
        stock_quantity = ?, category_id = ?, image_url = ?
      WHERE product_id = ?
    `;
    await db.query(sql, [
      product_name || old.product_name,
      description || old.description,
      price || old.price,
      stock_quantity || old.stock_quantity,
      category_id || old.category_id,
      image_url || old.image_url,
      id
    ]);

    res.status(200).json({ message: 'Cập nhật sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// (ADMIN) XÓA SẢN PHẨM (Xóa cứng)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM Products WHERE product_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }

    res.status(200).json({ message: 'Xóa sản phẩm thành công' });
  } catch (error)
  {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ message: 'Không thể xóa sản phẩm đã có trong đơn hàng.' });
    }
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
