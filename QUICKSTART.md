# Quick Start Guide - Testimonials System

## 🎯 Tóm tắt
Hệ thống testimonials sử dụng **Google Sheets** làm database miễn phí.

## 📝 Các bước setup (10-15 phút)

### 1️⃣ Tạo Google Sheet
1. Vào [Google Sheets](https://sheets.google.com)
2. Tạo sheet mới
3. Tạo header: `timestamp | name | position | content | approved`

### 2️⃣ Setup Apps Script
1. Extensions → Apps Script
2. Copy code từ `google-apps-script/Code.gs`
3. Paste vào editor
4. Cập nhật `SHEET_NAME` nếu cần (dòng 16)

### 3️⃣ Deploy Web App
1. Deploy → New deployment → Web app
2. Execute as: **Me**
3. Who has access: **Anyone**
4. Deploy → Copy URL

### 4️⃣ Cập nhật JavaScript
1. Mở `scripts/testimonials.js`
2. Thay `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` bằng URL vừa copy
3. Save

### 5️⃣ Test
1. Mở `index.html` trong browser
2. Gửi testimonial test
3. Kiểm tra Google Sheet
4. Đổi `approved` thành `TRUE`
5. Refresh web → Thấy testimonial hiển thị

## 📚 Hướng dẫn chi tiết
Xem file `README_GOOGLE_SHEETS.md`

## 🎨 Quản lý testimonials
- **Duyệt:** Đổi `approved` từ `FALSE` → `TRUE` trong Google Sheet
- **Xóa:** Delete row trong Google Sheet
- **Sửa:** Edit trực tiếp trong Google Sheet

## ⚡ Lưu ý
- Testimonials mới mặc định `approved = FALSE` (không hiển thị)
- Chỉ testimonials có `approved = TRUE` mới hiển thị trên web
- Không giới hạn số lượng testimonials
