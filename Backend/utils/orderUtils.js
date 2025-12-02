// Hàm tính tổng tiền của một giỏ hàng
// items: mảng các sản phẩm [{ price: 1000, quantity: 2 }, ...]
function calculateTotal(items) {
    // Case: Giỏ hàng rỗng hoặc null
    if (!items || items.length === 0) {
        return 0;
    }

    let total = 0;
    for (const item of items) {
        // Case: Giá hoặc số lượng bị âm (Lỗi dữ liệu)
        if (item.price < 0 || item.quantity < 0) {
            throw new Error("Giá hoặc số lượng không được âm");
        }
        total += item.price * item.quantity;
    }
    return total;
}

// Hàm kiểm tra xem đơn hàng có được Freeship không (trên 2 triệu)
function isFreeShip(totalAmount) {
    return totalAmount >= 2000000;
}

module.exports = { calculateTotal, isFreeShip };