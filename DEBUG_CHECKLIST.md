# 🔍 DEBUG CHECKLIST - Vui lòng làm theo từng bước

## ✅ Bước 1: Kiểm tra Apps Script Deployment Settings

Trong screenshot bạn vừa gửi, tôi thấy trang deployment settings. **QUAN TRỌNG:**

1. Scroll xuống phần **"Người có quyền truy cập"** (Who has access)
2. **PHẢI CHỌN**: **"Bất kỳ ai"** (Anyone)
3. **KHÔNG ĐƯỢC CHỌN**: "Chỉ bản thân tôi" hoặc "Chỉ người dùng trong tổ chức"
4. Chụp màn hình phần này và gửi cho tôi

---

## ✅ Bước 2: Test API trực tiếp trong browser

1. Copy URL này (URL mới nhất của bạn):
   ```
   https://script.google.com/macros/s/AKfycbwfGOAXP14sv1rD9dIJuaHbHHrT79CZa8TDNc40hCMNiZllW3uY_p9fdWA1xw5LROqg/exec
   ```

2. **Mở tab mới** trong browser
3. **Paste URL** vào address bar
4. Nhấn Enter
5. **Chụp màn hình** kết quả và gửi cho tôi

**Kết quả mong đợi:** Thấy JSON response với testimonials

**Nếu thấy lỗi:** Có vấn đề với deployment

---

## ✅ Bước 3: Kiểm tra Console trên GitHub Pages

1. Mở **Incognito/Private mode** (Ctrl+Shift+N)
2. Truy cập: `https://nhanhuutran007.github.io`
3. Nhấn **F12** để mở DevTools
4. Chuyển sang tab **Console**
5. Gõ lệnh này và nhấn Enter:
   ```javascript
   API_URL
   ```
6. **Chụp màn hình Console** và gửi cho tôi

**Kết quả mong đợi:** Thấy URL đúng

---

## ✅ Bước 4: Kiểm tra Network Tab

1. Vẫn ở trang `https://nhanhuutran007.github.io`
2. Mở DevTools (F12)
3. Chuyển sang tab **Network**
4. **Scroll xuống form** "Để lại đánh giá"
5. Điền thông tin và click **"GỬI ĐÁNH GIÁ"**
6. Trong Network tab, tìm request đến Apps Script URL
7. Click vào request đó
8. **Chụp màn hình** showing:
   - Request URL
   - Status code
   - Response tab
   - Headers tab

---

## ✅ Bước 5: Push code mới lên GitHub

Đảm bảo file `testimonials.js` với URL mới đã được push:

```bash
git add .
git commit -m "Update Apps Script URL"
git push origin main
```

Đợi 2-3 phút để GitHub Pages deploy.

---

## 📸 Tôi cần các screenshot sau:

1. ✅ **Apps Script deployment settings** - phần "Người có quyền truy cập"
2. ✅ **Kết quả khi mở API URL trực tiếp** trong browser
3. ✅ **Console tab** trên GitHub Pages (sau khi gõ `API_URL`)
4. ✅ **Network tab** khi gửi testimonial (showing request details)

Với 4 screenshot này, tôi sẽ biết chính xác vấn đề ở đâu! 🎯
