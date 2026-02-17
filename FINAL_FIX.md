# ⚠️ CẬP NHẬT URL SAU KHI DEPLOY MỚI

## Sau khi tạo deployment mới, làm theo:

1. Copy URL mới từ Apps Script
2. Mở file `scripts/testimonials.js`
3. Thay dòng 9:
   ```javascript
   const API_URL = 'URL_CŨ';
   ```
   Thành:
   ```javascript
   const API_URL = 'URL_MỚI_VỪA_COPY';
   ```

4. Lưu file (Ctrl+S)

5. Push lên GitHub:
   ```bash
   git add .
   git commit -m "Final: New Apps Script deployment with CORS"
   git push origin main
   ```

6. Đợi 2-3 phút

7. Test trên GitHub Pages (Incognito mode):
   - Mở `https://nhanhuutran007.github.io`
   - Gửi testimonial
   - ✅ THÀNH CÔNG!

---

## 🔑 TẠI SAO PHẢI TẠO MỚI?

- **Update deployment** (Edit → New version) đôi khi KHÔNG reset CORS settings
- **New deployment** sẽ tạo hoàn toàn mới với CORS headers đúng
- Đây là bug/limitation của Google Apps Script

---

## ✅ SAU KHI HOẠT ĐỘNG:

- Form gửi testimonial sẽ hoạt động
- Testimonials sẽ lưu vào Google Sheet
- Đổi `approved` = TRUE để hiển thị
- Refresh website → Thấy testimonial mới!

🎉 Đây là giải pháp cuối cùng và chắc chắn sẽ hoạt động!
