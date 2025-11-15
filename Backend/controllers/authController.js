const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. HÀM REGISTER (Đã cập nhật 'date_of_birth')
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password, date_of_birth } = req.body;

    if (!first_name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền các trường bắt buộc (first_name, email, password).' });
    }

    const [user] = await db.query('SELECT * FROM Customers WHERE email = ?', [email]);
    if (user.length > 0) {
      return res.status(400).json({ message: 'Email này đã được sử dụng.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const sql = 'INSERT INTO Customers (first_name, last_name, email, password_hash, date_of_birth) VALUES (?, ?, ?, ?, ?)';
    // Dùng || null để đảm bảo nếu date_of_birth là rỗng, nó sẽ chèn NULL vào DB
    const [result] = await db.query(sql, [first_name, last_name || null, email, password_hash, date_of_birth || null]);

    const newUserId = result.insertId;
    const token = jwt.sign(
      { id: newUserId, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Đăng ký thành công!',
      token: token,
      user_id: newUserId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 2. HÀM LOGIN (Đã sửa lỗi 500 / lỗi treo)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền cả email và password.' });
    }

    const [users] = await db.query('SELECT * FROM Customers WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Sai email hoặc mật khẩu.' });
    }

    const user = users[0];

    // KIỂM TRA QUAN TRỌNG (Sửa lỗi 500)
    // Nếu user tồn tại nhưng vì lý do nào đó không có password hash
    if (!user.password_hash) {
      return res.status(401).json({ message: 'Tài khoản này bị lỗi, không thể đăng nhập.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Sai email hoặc mật khẩu.' });
    }

    const token = jwt.sign(
      { id: user.customer_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token: token,
      user_id: user.customer_id,
      role: user.role
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 3. HÀM GETPROFILE (Đã cập nhật 'date_of_birth')
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.customer_id;
    
    const [users] = await db.query(
      'SELECT customer_id, first_name, last_name, email, shipping_address, phone_number, date_of_birth FROM Customers WHERE customer_id = ?', 
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    res.status(200).json(users[0]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// 4. HÀM UPDATEPROFILE (Đã cập nhật 'date_of_birth')
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.customer_id;
    const { first_name, last_name, shipping_address, phone_number, date_of_birth } = req.body;

    const [users] = await db.query('SELECT * FROM Customers WHERE customer_id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    const user = users[0];

    // Kiểm tra và giữ lại giá trị cũ nếu giá trị mới là undefined
    const newFirstName = first_name !== undefined ? first_name : user.first_name;
    const newLastName = last_name !== undefined ? last_name : user.last_name;
    const newAddress = shipping_address !== undefined ? shipping_address : user.shipping_address;
    const newPhone = phone_number !== undefined ? phone_number : user.phone_number;
    const newDOB = date_of_birth !== undefined ? (date_of_birth || null) : user.date_of_birth;

    const sql = `
      UPDATE Customers
      SET 
        first_name = ?, last_name = ?, shipping_address = ?, 
        phone_number = ?, date_of_birth = ?
      WHERE customer_id = ?
    `;
    
    await db.query(sql, [
      newFirstName,
      newLastName,
      newAddress,
      newPhone,
      newDOB,
      userId
    ]);

    const [updatedUsers] = await db.query(
      'SELECT customer_id, email, first_name, last_name, shipping_address, phone_number, role, date_of_birth FROM Customers WHERE customer_id = ?', 
      [userId]
    );

    res.status(200).json({
      message: 'Cập nhật thông tin thành công!',
      user: updatedUsers[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};