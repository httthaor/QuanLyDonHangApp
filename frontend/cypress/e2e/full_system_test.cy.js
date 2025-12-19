describe('Kiểm thử Giao diện Người dùng (UI Navigation)', () => {

  it('Kịch bản: Lướt web -> Xem sản phẩm -> Thử nhập liệu', () => {
    
    // --- BƯỚC 1: TRANG CHỦ ---
    cy.log('--- 1. KIỂM TRA TRANG CHỦ ---');
    cy.visit('http://localhost:5173/');
    
    cy.contains('App Quản Lý Đơn Hàng').should('be.visible'); 
    cy.contains('Sản phẩm nổi bật', { timeout: 10000 }).should('be.visible'); 
    
    cy.wait(1000);

    // --- BƯỚC 2: TÌM KIẾM SẢN PHẨM ---
    cy.log('--- 2. TEST THANH TÌM KIẾM ---');
    cy.get('input[placeholder="Tìm kiếm sản phẩm..."]').type('Áo{enter}');
    
    // Kiểm tra URL có đổi sang trang search không
    cy.url().should('include', '/search');
    cy.wait(1000);
    
    // Quay lại trang chủ 
    cy.contains('App Quản Lý Đơn Hàng').click();

    // --- BƯỚC 3: XEM CHI TIẾT SẢN PHẨM ---
    cy.log('--- 3. XEM CHI TIẾT ---');
    // Tìm thẻ sản phẩm đầu tiên và click vào ảnh hoặc tên
    cy.get('img[alt]').first().click({ force: true });
    
    // Kiểm tra xem đã vào trang chi tiết chưa
    cy.url().should('include', '/product/');
    cy.contains('Thêm vào Giỏ hàng').should('be.visible');
    cy.contains('Quay lại Trang chủ').should('be.visible');
    cy.wait(1000);

    // --- BƯỚC 4: THỬ NÚT MUA HÀNG (KHI CHƯA LOGIN) ---
    cy.log('--- 4. TEST NÚT MUA (CHƯA LOGIN) ---');
    cy.contains('Thêm vào Giỏ hàng').click();
    
    // Hệ thống phải báo cần đăng nhập (Alert)
    cy.on('window:alert', (str) => {
        expect(str).to.contain('cần đăng nhập');
    });
    
    cy.wait(1000);

    // --- BƯỚC 5: KIỂM TRA TRANG ĐĂNG NHẬP ---
    cy.log('--- 5. TEST FORM ĐĂNG NHẬP ---');
    // Click link Đăng nhập trên header
    cy.contains('a', 'Đăng nhập').click(); 
    
    // Kiểm tra form hiện ra
    cy.contains('h2', 'Đăng Nhập').should('be.visible');
    
    // Thử nhập liệu (Test UI input)
    cy.get('input[type="email"]').type('test_ui@gmail.com');
    cy.get('input[type="password"]').type('123456');
    
    cy.wait(1000);

    // --- BƯỚC 6: KIỂM TRA TRANG ĐĂNG KÝ ---
    cy.log('--- 6. TEST FORM ĐĂNG KÝ ---');
    // Click link Đăng ký trên header
    cy.contains('a', 'Đăng ký').click();
    
    // Kiểm tra form hiện ra
    cy.contains('h2', 'Đăng Ký Tài Khoản').should('be.visible');
    
    // Thử nhập liệu đầy đủ
    cy.get('input[name="first_name"]').type('Nguyen');
    cy.get('input[name="last_name"]').type('Van A');
    
    // Kiểm tra ô ngày sinh có nhập được không
    cy.get('body').then(($body) => {
        if ($body.find('input[name="date_of_birth"]').length > 0) {
            cy.get('input[name="date_of_birth"]').type('2000-01-01');
        }
    });
    
    cy.get('input[name="email"]').type('nguyenvana@gmail.com');
    cy.get('input[name="password"]').type('password123');
    
    // Kết thúc test tại đây (XANH LÈ)
    cy.log('--- HOÀN THÀNH KIỂM THỬ UI ---');
  });
});