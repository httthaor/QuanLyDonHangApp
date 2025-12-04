/**
 * Hàm tính tổng tiền đơn hàng
 * Logic: Cộng dồn (Giá * Số lượng) của từng sản phẩm
 */
function calculateTotal(cartItems) {
    if (!cartItems || cartItems.length === 0) {
        return 0;
    }

    let total = 0;
    for (const item of cartItems) {
        // Kiểm tra dữ liệu rác (Giá âm, số lượng âm)
        if (item.price < 0 || item.quantity <= 0) {
            throw new Error("Dữ liệu sản phẩm không hợp lệ (Giá hoặc số lượng bị sai)");
        }
        total += Number(item.price) * Number(item.quantity);
    }
    return total;
}

/**
 * Hàm kiểm tra dữ liệu đầu vào khi tạo đơn (Validation)
 * Logic: Phải có địa chỉ, phải có phương thức thanh toán hợp lệ
 */
function validateOrderInput(data) {
    // 1. Kiểm tra địa chỉ
    if (!data.shipping_address || data.shipping_address.trim() === "") {
        return { valid: false, error: "Thiếu địa chỉ giao hàng" };
    }

    // 2. Kiểm tra phương thức thanh toán
    const validMethods = ['COD', 'E_WALLET'];
    if (!data.payment_method || !validMethods.includes(data.payment_method)) {
        return { valid: false, error: "Phương thức thanh toán không hợp lệ (Phải là COD hoặc E_WALLET)" };
    }

    // Nếu OK hết
    return { valid: true, error: null };
}

module.exports = { calculateTotal, validateOrderInput };