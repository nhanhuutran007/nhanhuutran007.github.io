# 🐛 Hướng dẫn Debug lỗi kết nối

## Vấn đề hiện tại
Lỗi: "Không thể kết nối đến server. Vui lòng thử lại sau."

## 🔍 Các bước debug

### Bước 1: Sử dụng trang test
1. Mở file `test-api.html` trong browser
2. Chạy **Test 1** (GET Request)
3. Chạy **Test 2** (POST Request)
4. Chụp màn hình kết quả và gửi cho tôi

### Bước 2: Kiểm tra Apps Script Deployment

#### 2.1. Kiểm tra deployment settings
1. Mở Google Apps Script Editor
2. Click **Deploy** → **Manage deployments**
3. Kiểm tra:
   - ✅ Execute as: **Me** (email của bạn)
   - ✅ Who has access: **Anyone**
   
#### 2.2. Kiểm tra URL
1. Copy lại Web App URL từ deployment
2. URL phải có dạng: `https://script.google.com/macros/s/AKfycby.../exec`
3. Đảm bảo URL kết thúc bằng `/exec` (KHÔNG phải `/dev`)

### Bước 3: Test API trực tiếp

#### 3.1. Mở API trong browser
1. Copy Apps Script URL
2. Paste vào address bar của browser
3. Nhấn Enter
4. **Kết quả mong đợi:** Thấy JSON response như:
   ```json
   {
     "success": true,
     "data": [...],
     "message": "Lấy danh sách testimonials thành công"
   }
   ```

#### 3.2. Nếu thấy lỗi "Authorization required"
- Apps Script chưa được authorize đúng cách
- Giải pháp:
  1. Quay lại Apps Script Editor
  2. Chọn function `testSheet`
  3. Click Run (▶️)
  4. Authorize lại

### Bước 4: Kiểm tra Console Errors

1. Mở trang web (`index.html`)
2. Nhấn **F12** để mở Developer Tools
3. Chuyển sang tab **Console**
4. Thử gửi testimonial
5. Xem lỗi gì hiện ra trong Console
6. Chụp màn hình và gửi cho tôi

### Bước 5: Kiểm tra Network Tab

1. Mở Developer Tools (F12)
2. Chuyển sang tab **Network**
3. Thử gửi testimonial
4. Tìm request đến Apps Script URL
5. Click vào request đó
6. Xem:
   - **Status code** (200, 404, 500, etc.)
   - **Response** tab để xem response body
   - **Headers** tab để xem request/response headers
7. Chụp màn hình và gửi cho tôi

## 🔧 Các nguyên nhân thường gặp

### 1. URL sai
- ❌ URL có `/dev` thay vì `/exec`
- ❌ URL bị thiếu hoặc thừa ký tự
- ✅ Giải pháp: Copy lại URL từ deployment

### 2. Deployment settings sai
- ❌ "Who has access" = "Only myself"
- ✅ Phải chọn "Anyone"

### 3. Apps Script chưa được authorize
- ❌ Chưa chạy function test để authorize
- ✅ Chạy `testSheet()` function

### 4. Tên sheet sai
- ❌ `SHEET_NAME = 'Sheet1'` nhưng sheet thực tế là "Trang tính1"
- ✅ Đổi thành `SHEET_NAME = 'Trang tính1'`

### 5. CORS issues (ít gặp với Apps Script)
- Apps Script tự động xử lý CORS
- Nếu vẫn lỗi CORS, thử deploy version mới

## 📸 Thông tin cần cung cấp

Để tôi có thể giúp debug, hãy cung cấp:

1. **Screenshot của test-api.html** sau khi chạy Test 1 và Test 2
2. **Screenshot của Console** (F12 → Console tab)
3. **Screenshot của Network tab** (F12 → Network tab) khi gửi testimonial
4. **Screenshot của Apps Script Deployment settings**
5. **Kết quả khi mở API URL trực tiếp trong browser**

## 🚀 Quick Fix

Nếu vẫn không hoạt động, thử các bước này:

### Option 1: Redeploy hoàn toàn
1. Trong Apps Script, click **Deploy** → **Manage deployments**
2. Click icon 🗑️ (Archive) để xóa deployment cũ
3. Tạo deployment mới:
   - Deploy → New deployment
   - Web app
   - Execute as: Me
   - Who has access: Anyone
4. Copy URL mới
5. Cập nhật lại trong `testimonials.js`

### Option 2: Kiểm tra lại code Apps Script
1. Đảm bảo `SHEET_NAME` đúng
2. Đảm bảo không có lỗi syntax
3. Chạy `testSheet()` để kiểm tra

### Option 3: Tạo sheet mới
1. Tạo Google Sheet mới
2. Đặt tên tab là "Sheet1" (tiếng Anh)
3. Tạo header: timestamp | name | position | content | approved
4. Cập nhật Apps Script: `SHEET_NAME = 'Sheet1'`
5. Deploy lại
