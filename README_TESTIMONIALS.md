# Hướng dẫn cài đặt hệ thống Testimonials

## 📋 Tổng quan
Hệ thống cho phép người dùng gửi đánh giá (testimonials) qua form, lưu vào MySQL database, và hiển thị các đánh giá đã được duyệt lên phần References.

## 🗂️ Cấu trúc files đã tạo

```
nhanhuutran007.github.io/
├── api/
│   ├── config.php          # Cấu hình kết nối MySQL
│   └── testimonials.php    # API endpoint xử lý testimonials
├── database/
│   └── schema.sql          # Schema MySQL cho bảng testimonials
├── scripts/
│   └── testimonials.js     # JavaScript xử lý frontend
└── index.html              # Đã cập nhật form và script
```

## 🔧 Các bước cài đặt

### Bước 1: Tạo Database Schema
1. Đăng nhập vào phpMyAdmin hoặc MySQL client
2. Chọn database `Portfolio`
3. Chạy file `database/schema.sql` để tạo bảng `testimonials`

```sql
-- File này sẽ tạo:
-- - Bảng testimonials với các trường: id, name, position, content, avatar_url, is_approved, created_at, updated_at
-- - Insert 2 testimonials mẫu (Ngọc Nhi và Mẹc siuu)
```

### Bước 2: Upload files PHP lên server
1. Upload thư mục `api/` lên server của bạn tại `host80.vietnix.vn`
2. Đảm bảo đường dẫn là: `https://nhanhuutran007.github.io/api/`

**Lưu ý quan trọng:**
- GitHub Pages **KHÔNG hỗ trợ PHP**
- Bạn cần upload các file PHP lên hosting Vietnix của bạn
- Cập nhật URL trong file `scripts/testimonials.js`:

```javascript
// Thay đổi dòng này:
const API_URL = 'https://nhanhuutran007.github.io/api/testimonials.php';

// Thành URL thực tế của hosting Vietnix:
const API_URL = 'https://your-vietnix-domain.com/api/testimonials.php';
```

### Bước 3: Kiểm tra kết nối
1. Truy cập: `https://your-vietnix-domain.com/api/testimonials.php`
2. Bạn sẽ thấy JSON response với danh sách testimonials

### Bước 4: Test chức năng
1. Mở trang web của bạn
2. Scroll xuống phần "Để lại đánh giá"
3. Điền form và gửi
4. Kiểm tra database xem testimonial đã được lưu chưa

## 🔐 Bảo mật

### Các biện pháp đã áp dụng:
- ✅ Prepared Statements (tránh SQL Injection)
- ✅ Input validation và sanitization
- ✅ XSS protection (escapeHtml)
- ✅ CORS headers
- ✅ Giới hạn độ dài input
- ✅ Hệ thống duyệt (is_approved = 0 mặc định)

### Khuyến nghị thêm:
- Thêm CAPTCHA để tránh spam
- Rate limiting cho API
- Thêm authentication cho admin panel

## 📊 Quản lý Testimonials

### Duyệt testimonials thủ công:
```sql
-- Xem testimonials chưa duyệt
SELECT * FROM testimonials WHERE is_approved = 0 ORDER BY created_at DESC;

-- Duyệt testimonial (thay ID)
UPDATE testimonials SET is_approved = 1 WHERE id = [ID];

-- Xóa testimonial spam
DELETE FROM testimonials WHERE id = [ID];
```

### Tạo Admin Panel (tùy chọn):
Bạn có thể tạo thêm file `api/admin.php` để quản lý testimonials qua giao diện web.

## 🎨 Tùy chỉnh

### Thay đổi số lượng testimonials hiển thị:
Trong `api/testimonials.php`, thêm LIMIT:
```php
$sql = "SELECT ... FROM testimonials WHERE is_approved = 1 ORDER BY created_at DESC LIMIT 10";
```

### Thêm avatar cho testimonials:
1. Upload ảnh lên server
2. Cập nhật `avatar_url` trong database:
```sql
UPDATE testimonials SET avatar_url = 'images/avatar-name.jpg' WHERE id = [ID];
```

## 🐛 Troubleshooting

### Lỗi kết nối database:
- Kiểm tra thông tin trong `api/config.php`
- Đảm bảo database `Portfolio` đã tồn tại
- Kiểm tra user `githubio_admin` có quyền truy cập

### CORS errors:
- Đảm bảo `api/config.php` có headers CORS
- Kiểm tra URL trong `testimonials.js` đúng

### Form không gửi được:
- Mở Developer Console (F12) để xem lỗi
- Kiểm tra API URL có đúng không
- Kiểm tra server có chạy PHP không

## 📝 API Documentation

### GET /api/testimonials.php
Lấy danh sách testimonials đã duyệt

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ngọc Nhi",
      "position": "CTV / Designer",
      "content": "Nhan displays exemplary...",
      "avatar_url": null,
      "created_at": "2024-02-17 10:00:00"
    }
  ],
  "message": "Lấy danh sách testimonials thành công"
}
```

### POST /api/testimonials.php
Thêm testimonial mới

**Request Body:**
```json
{
  "name": "Tên người dùng",
  "position": "Chức vụ",
  "content": "Nội dung đánh giá"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "message": "Cảm ơn bạn đã gửi đánh giá!..."
  },
  "message": "Thêm testimonial thành công"
}
```

## 🚀 Nâng cấp trong tương lai

1. **Admin Dashboard**: Tạo giao diện quản lý testimonials
2. **Rating System**: Thêm hệ thống đánh giá sao
3. **Image Upload**: Cho phép upload avatar
4. **Email Notification**: Thông báo khi có testimonial mới
5. **Pagination**: Phân trang cho nhiều testimonials
6. **Search & Filter**: Tìm kiếm và lọc testimonials

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Database connection
2. PHP version (khuyến nghị >= 7.4)
3. File permissions
4. Error logs trên server
