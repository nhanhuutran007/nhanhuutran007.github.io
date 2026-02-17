# Hướng dẫn cài đặt Google Sheets Testimonials System

## 📋 Tổng quan
Hệ thống testimonials sử dụng **Google Sheets + Apps Script** làm backend miễn phí, không cần hosting PHP.

---

## 🚀 Bước 1: Tạo Google Sheet

### 1.1. Tạo Sheet mới
1. Truy cập [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** để tạo sheet mới
3. Đặt tên sheet: **Portfolio Testimonials**

### 1.2. Tạo Header Row
Trong dòng đầu tiên (Row 1), tạo các cột sau:

| A | B | C | D | E |
|---|---|---|---|---|
| timestamp | name | position | content | approved |

**Giải thích:**
- `timestamp`: Thời gian gửi testimonial
- `name`: Tên người đánh giá
- `position`: Chức vụ/vị trí
- `content`: Nội dung đánh giá
- `approved`: TRUE/FALSE (đã duyệt hay chưa)

### 1.3. Thêm dữ liệu mẫu (Optional)
Bạn có thể thêm 2 testimonials mẫu:

| timestamp | name | position | content | approved |
|-----------|------|----------|---------|----------|
| 2024-02-17 10:00:00 | Ngọc Nhi | CTV / Designer | Nhan displays exemplary professionalism and is able to take on challenges. I love his. | TRUE |
| 2024-02-17 10:05:00 | Mẹc siuu | Coder Part-Time/ Web Designer | Nhan is a great co-worker and problem solver. He is quick to extend his helping hand and makes a good team player. | TRUE |

---

## 🔧 Bước 2: Tạo Apps Script

### 2.1. Mở Apps Script Editor
1. Trong Google Sheet, click menu **Extensions** → **Apps Script**
2. Một tab mới sẽ mở ra với code editor

### 2.2. Paste Code
1. Xóa toàn bộ code mặc định (`function myFunction() {...}`)
2. Mở file `google-apps-script/Code.gs` trong project của bạn
3. Copy toàn bộ nội dung
4. Paste vào Apps Script Editor

### 2.3. Cập nhật tên Sheet (nếu cần)
Nếu bạn đặt tên sheet khác "Sheet1", cập nhật dòng 16:

```javascript
const SHEET_NAME = 'Sheet1'; // Thay bằng tên sheet của bạn
```

### 2.4. Test Script (Optional)
1. Chọn function `testSheet` từ dropdown
2. Click **Run** (▶️)
3. Lần đầu chạy sẽ yêu cầu authorize → Click **Review Permissions**
4. Chọn tài khoản Google của bạn
5. Click **Advanced** → **Go to [Project Name] (unsafe)**
6. Click **Allow**
7. Xem kết quả trong **Execution log**

---

## 🌐 Bước 3: Deploy Web App

### 3.1. Deploy
1. Click **Deploy** → **New deployment**
2. Click icon ⚙️ bên cạnh "Select type"
3. Chọn **Web app**

### 3.2. Cấu hình Deployment
Điền thông tin:

- **Description**: `Testimonials API v1` (hoặc tùy ý)
- **Execute as**: **Me** (your-email@gmail.com)
- **Who has access**: **Anyone**

> ⚠️ **Quan trọng:** Phải chọn "Anyone" để website có thể gọi API

### 3.3. Deploy
1. Click **Deploy**
2. Lại phải authorize lần nữa → Click **Authorize access**
3. Chọn tài khoản → **Allow**
4. Sau khi deploy thành công, bạn sẽ thấy **Web app URL**

### 3.4. Copy Web App URL
URL sẽ có dạng:
```
https://script.google.com/macros/s/AKfycby.../exec
```

**LƯU LẠI URL NÀY!** Bạn sẽ cần nó ở bước tiếp theo.

---

## 💻 Bước 4: Cập nhật JavaScript

### 4.1. Mở file testimonials.js
File: `scripts/testimonials.js`

### 4.2. Thay thế API URL
Tìm dòng 10:
```javascript
const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
```

Thay bằng URL bạn vừa copy:
```javascript
const API_URL = 'https://script.google.com/macros/s/AKfycby.../exec';
```

### 4.3. Save file
Ctrl+S để lưu

---

## ✅ Bước 5: Test hệ thống

### 5.1. Test trên local
1. Mở `index.html` trong browser
2. Scroll xuống phần "Để lại đánh giá"
3. Điền form:
   - Tên: "Test User"
   - Chức vụ: "Tester"
   - Nội dung: "This is a test testimonial"
4. Click "Gửi đánh giá"

**Kết quả mong đợi:**
- Thấy thông báo "Cảm ơn bạn đã gửi đánh giá!"
- Mở Google Sheet, thấy dòng mới với `approved = FALSE`

### 5.2. Duyệt testimonial
1. Mở Google Sheet
2. Tìm dòng "Test User"
3. Đổi cột `approved` từ `FALSE` thành `TRUE`

### 5.3. Kiểm tra hiển thị
1. Refresh trang web
2. Scroll xuống phần "References"
3. Thấy testimonial "Test User" hiển thị

---

## 🎯 Bước 6: Deploy lên GitHub Pages

### 6.1. Commit & Push
```bash
git add .
git commit -m "Add Google Sheets testimonials system"
git push origin main
```

### 6.2. Truy cập website
Mở `https://nhanhuutran007.github.io` và test lại

---

## 📝 Quản lý Testimonials

### Duyệt testimonials
1. Mở Google Sheet
2. Tìm testimonial cần duyệt (cột `approved = FALSE`)
3. Đổi `FALSE` thành `TRUE`
4. Testimonial sẽ tự động hiển thị trên web (sau khi refresh)

### Xóa testimonials spam
1. Mở Google Sheet
2. Click chuột phải vào số dòng
3. Chọn **Delete row**

### Sắp xếp theo thời gian
1. Chọn toàn bộ dữ liệu (kể cả header)
2. Click **Data** → **Sort range**
3. Chọn sort by `timestamp`, Z → A (mới nhất lên đầu)

---

## 🔄 Cập nhật Apps Script

Nếu cần sửa code Apps Script:

1. Mở Apps Script Editor
2. Sửa code
3. Click **Deploy** → **Manage deployments**
4. Click ✏️ (Edit) ở deployment hiện tại
5. Chọn **New version**
6. Click **Deploy**

**Lưu ý:** URL không đổi, không cần cập nhật lại trong JavaScript

---

## 🐛 Troubleshooting

### Lỗi: "API_URL is not defined"
**Nguyên nhân:** Chưa thay API_URL trong `testimonials.js`

**Giải pháp:** Xem lại Bước 4

### Lỗi: "Sheet not found"
**Nguyên nhân:** Tên sheet trong Apps Script không khớp với tên thực tế

**Giải pháp:** 
1. Kiểm tra tên sheet trong Google Sheets (tab dưới cùng)
2. Cập nhật `SHEET_NAME` trong Apps Script (dòng 16)

### Form gửi nhưng không thấy trong Sheet
**Nguyên nhân:** 
- Apps Script chưa được authorize
- Deployment settings sai

**Giải pháp:**
1. Chạy function `testSheet` để authorize
2. Kiểm tra deployment: "Who has access" phải là "Anyone"

### Testimonials không hiển thị trên web
**Nguyên nhân:** Cột `approved` không phải `TRUE`

**Giải pháp:** Đổi `approved` thành `TRUE` (viết hoa, không có dấu ngoặc)

### Lỗi CORS
**Nguyên nhân:** Google Apps Script đã tự động xử lý CORS

**Giải pháp:** Không cần làm gì, lỗi này không xảy ra với Apps Script

---

## 📊 Giới hạn

- **Requests/day**: 20,000 (đủ cho website cá nhân)
- **Script runtime**: 6 phút/execution
- **Storage**: Unlimited (Google Sheets)

---

## 🔐 Bảo mật

### Chống spam
Apps Script có thể bị spam. Để giảm thiểu:

1. **Theo dõi thường xuyên:** Kiểm tra Google Sheet mỗi ngày
2. **Thêm CAPTCHA:** Sử dụng Google reCAPTCHA (nâng cao)
3. **Rate limiting:** Thêm logic kiểm tra IP (nâng cao)

### Bảo vệ dữ liệu
- Google Sheet chỉ bạn mới edit được
- Apps Script chạy dưới quyền của bạn
- Testimonials chưa duyệt không hiển thị trên web

---

## 🎉 Hoàn thành!

Bây giờ bạn đã có hệ thống testimonials hoạt động hoàn toàn miễn phí! 🚀

Nếu có vấn đề, hãy kiểm tra lại từng bước hoặc xem phần Troubleshooting.
