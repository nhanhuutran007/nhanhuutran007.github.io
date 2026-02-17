# 🔧 Fix: Cache và Deployment Issues

## Vấn đề hiện tại
GitHub Pages đã deploy nhưng vẫn lỗi "Không thể kết nối đến server"

## Nguyên nhân có thể
1. **Browser cache** - Browser đang dùng file JavaScript cũ
2. **GitHub Pages cache** - GitHub chưa deploy version mới
3. **API URL chưa được push** - File testimonials.js trên GitHub vẫn là version cũ

## ✅ Giải pháp

### Bước 1: Xóa cache browser
1. Mở DevTools (F12)
2. Right-click nút Refresh
3. Chọn **"Empty Cache and Hard Reload"** (hoặc Ctrl+Shift+R)

### Bước 2: Kiểm tra file trên GitHub
1. Truy cập: https://github.com/nhanhuutran007/nhanhuutran007.github.io
2. Mở file `scripts/testimonials.js`
3. Kiểm tra dòng 9: API_URL có đúng là URL mới không?
   ```javascript
   const API_URL = 'https://script.google.com/macros/s/AKfycbyNikXWfkkew9O8kT957_JH8fytrxDnP-_J4ZqLd60XcOBTsSNzQeBgBGJB17r4UVCn/exec';
   ```

### Bước 3: Push lại với cache busting
Tôi đã cập nhật version number trong index.html:
```html
<script src="scripts/testimonials.js?ver=2.0.0"></script>
```

Chạy:
```bash
git add .
git commit -m "Fix: Update API URL and bust cache"
git push origin main
```

### Bước 4: Đợi và test
1. Đợi 2-3 phút để GitHub Pages deploy
2. Mở browser **Incognito/Private mode**
3. Truy cập: https://nhanhuutran007.github.io
4. Test gửi testimonial

## 🔍 Debug trên GitHub Pages

### Kiểm tra Console
1. Mở trang https://nhanhuutran007.github.io
2. Nhấn F12 → Console tab
3. Xem có lỗi gì không
4. Chụp màn hình gửi cho tôi

### Kiểm tra Network
1. F12 → Network tab
2. Gửi testimonial
3. Tìm request đến Apps Script URL
4. Xem Status code và Response
5. Chụp màn hình gửi cho tôi

### Kiểm tra API URL đang được dùng
1. F12 → Console tab
2. Gõ lệnh: `API_URL`
3. Nhấn Enter
4. Xem URL có đúng không

## 🚀 Quick Test
Mở Incognito mode và test URL này:
https://nhanhuutran007.github.io?nocache=1

Nếu vẫn lỗi, gửi cho tôi screenshot của:
- Console (F12)
- Network tab (khi gửi testimonial)
