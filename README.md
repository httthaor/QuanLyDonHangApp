# BÁO CÁO ĐỒ ÁN MÔN HỌC

### 1. Tổng quan đề tài

#### 1.1. Giới thiệu

- Tên đề tài: Mini App Quản Lý Đơn Hàng Cho Shop Online

- Mục tiêu: Xây dựng một hệ thống bán hàng hoàn chỉnh bao gồm giao diện mua sắm cho khách hàng và trang quản trị cho chủ cửa hàng.

#### 1.2. Công nghệ sử dụng
  
- Backend: Node.js, Express.js
  
- Database: MySQL Workbench
  
- Frontend: React.js, Tailwind CSS
  
- Kiểm thử: Jest (Unit Test), Cypress (UI/Integration Test), Thunder Client (API Test).

#### 1.3. Mô hình hoạt động 

Khác với các sàn thương mại điện tử như Shopee hay Lazada, hệ thống này được xây dựng theo mô hình single vendor (Đơn nhà cung cấp).

- Đặc điểm: Hệ thống chỉ có duy nhất một đơn vị bán hàng (Admin/Chủ shop).
  
- Phân quyền:
  
-    Admin (Chủ shop): Người duy nhất có quyền nhập liệu sản phẩm, quản lý kho, xử lý trạng thái đơn hàng và xem báo cáo doanh thu.
  
-    Customer (Khách hàng): Người dùng thực hiện các thao tác đăng ký tài khoản, xem sản phẩm và đặt mua hàng.
  
- Lý do lựa chọn: Mô hình này phù hợp với quy mô đồ án môn học, giúp tập trung sâu vào việc xử lý logic đơn hàng, tính toán doanh thu và trải nghiệm người dùng thay vì phân tán vào việc quản lý đa gian hàng phức tạp.
