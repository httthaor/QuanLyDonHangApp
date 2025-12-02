const { calculateTotal, isFreeShip } = require('../utils/orderUtils');

// === NHÓM TEST 1: KIỂM THỬ HÀM TÍNH TỔNG ===
describe('Kiểm thử Unit: Hàm calculateTotal', () => {
    
    test('TC-01: Tính đúng tổng tiền cho giỏ hàng bình thường', () => {
        const cartItems = [
            { price: 100000, quantity: 2 }, // 200k
            { price: 50000, quantity: 1 }   // 50k
        ];
        // Mong đợi kết quả là 250.000
        expect(calculateTotal(cartItems)).toBe(250000);
    });

    test('TC-02: Trả về 0 nếu giỏ hàng rỗng', () => {
        const cartItems = [];
        expect(calculateTotal(cartItems)).toBe(0);
    });

    test('TC-03: Báo lỗi nếu số lượng bị âm (Test case lỗi)', () => {
        const cartItems = [
            { price: 100000, quantity: -1 }
        ];
        // Mong đợi hàm sẽ ném ra lỗi (Throw Error)
        expect(() => calculateTotal(cartItems)).toThrow("Giá hoặc số lượng không được âm");
    });
});

// === NHÓM TEST 2: KIỂM THỬ HÀM FREESHIP ===
describe('Kiểm thử Unit: Hàm isFreeShip', () => {

    test('TC-04: Không Freeship nếu dưới 2 triệu', () => {
        expect(isFreeShip(1999999)).toBe(false);
    });

    test('TC-05: Được Freeship nếu đúng 2 triệu (Biên)', () => {
        expect(isFreeShip(2000000)).toBe(true);
    });

    test('TC-06: Được Freeship nếu trên 2 triệu', () => {
        expect(isFreeShip(5000000)).toBe(true);
    });
});