const { calculateTotal, validateOrderInput } = require('../utils/orderUtils');

// === PHẦN 1: TEST HÀM TÍNH TIỀN ===
describe('Unit Test: Hàm calculateTotal (Tính tổng tiền)', () => {
    
    test('TC-01: Tính đúng tổng tiền cho giỏ hàng có 2 món', () => {
        // Giả lập giỏ hàng: 2 cái áo (300k) + 1 cái quần (500k)
        const cartItems = [
            { price: 300000, quantity: 2 }, 
            { price: 500000, quantity: 1 } 
        ];
        // Kỳ vọng: (300k * 2) + (500k * 1) = 1.100.000
        expect(calculateTotal(cartItems)).toBe(1100000);
    });

    test('TC-02: Trả về 0 nếu giỏ hàng rỗng', () => {
        const cartItems = [];
        expect(calculateTotal(cartItems)).toBe(0);
    });

    test('TC-03: Báo lỗi nếu dữ liệu sai (Giá âm)', () => {
        const cartItems = [
            { price: -100000, quantity: 1 } // Giá âm là vô lý
        ];
        // Kỳ vọng: Hàm sẽ ném ra lỗi (Error)
        expect(() => calculateTotal(cartItems)).toThrow("Dữ liệu sản phẩm không hợp lệ");
    });
});

// === PHẦN 2: TEST HÀM KIỂM TRA DỮ LIỆU ĐẦU VÀO ===
describe('Unit Test: Hàm validateOrderInput (Kiểm tra đầu vào)', () => {

    test('TC-04: Báo lỗi nếu thiếu địa chỉ giao hàng', () => {
        const input = {
            shipping_address: "", 
            payment_method: "COD"
        };
        const result = validateOrderInput(input);
        
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Thiếu địa chỉ giao hàng");
    });

    test('TC-05: Hợp lệ nếu đủ thông tin và đúng phương thức', () => {
        const input = {
            shipping_address: "123 Đường A, Quận B",
            payment_method: "E_WALLET"
        };
        const result = validateOrderInput(input);

        expect(result.valid).toBe(true);
        expect(result.error).toBe(null);
    });
});