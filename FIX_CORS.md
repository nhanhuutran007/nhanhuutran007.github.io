# 🔧 FIX: CORS Error với Google Apps Script

## ❌ Vấn đề
```
Access to fetch blocked by CORS policy: No 'Access-Control-Allow-Origin' header
```

## ✅ Giải pháp: Redeploy Apps Script

### Bước 1: Xóa deployment cũ
1. Mở Google Apps Script Editor
2. Click **Deploy** → **Manage deployments**
3. Click icon **🗑️ (Archive)** để xóa deployment hiện tại
4. Click **Done**

### Bước 2: Tạo deployment MỚI
1. Click **Deploy** → **New deployment**
2. Click icon ⚙️ bên cạnh "Select type"
3. Chọn **Web app**
4. Điền thông tin:
   - **Description**: `Testimonials API v2`
   - **Execute as**: **Me** (your-email@gmail.com)
   - **Who has access**: **Anyone** ⚠️ QUAN TRỌNG!
5. Click **Deploy**
6. Authorize nếu được yêu cầu
7. **Copy URL mới**

### Bước 3: Cập nhật URL trong code

1. Mở file `scripts/testimonials.js`
2. Thay dòng 9:
   ```javascript
   const API_URL = 'URL_CŨ';
   ```
   Thành URL mới vừa copy:
   ```javascript
   const API_URL = 'https://script.google.com/macros/s/NEW_ID/exec';
   ```

3. Lưu file (Ctrl+S)

### Bước 4: Cập nhật test-api.html (optional)
Cập nhật URL trong `test-api.html` dòng 137 nếu muốn test

### Bước 5: Push lên GitHub
```bash
git add .
git commit -m "Fix: Update Apps Script URL after redeploy"
git push origin main
```

### Bước 6: Test
1. Đợi 2-3 phút
2. Mở **Incognito mode**
3. Truy cập: `https://nhanhuutran007.github.io`
4. Thử gửi testimonial
5. ✅ Thành công!

---

## 🔍 Tại sao phải redeploy?

Đôi khi Apps Script deployment bị lỗi CORS nếu:
- Deployment được tạo trước khi code hoàn chỉnh
- Settings không đúng
- Cache của Google

Redeploy hoàn toàn sẽ fix vấn đề này.

---

## ⚠️ LƯU Ý QUAN TRỌNG

Khi tạo deployment mới:
- ✅ **Who has access** PHẢI là **Anyone**
- ✅ **Execute as** PHẢI là **Me**
- ✅ URL sẽ THAY ĐỔI → Phải cập nhật lại trong code
