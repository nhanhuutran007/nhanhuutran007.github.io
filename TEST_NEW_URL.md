# 🧪 TEST URL MỚI

## Bước 1: Test URL trực tiếp

Mở tab mới và paste URL này:
```
https://script.google.com/macros/s/AKfycbySeJhmoIi3vyhE3Ic7MgkLc5iplZ-z8RnmGA5BeL2u6p_Eq8ZA1JuCGmeZmWdI0BQG/exec
```

**Kết quả mong đợi:** Thấy JSON với testimonials

**Nếu thấy lỗi hoặc trang trống:** Có vấn đề với deployment

---

## Bước 2: Push code mới

Tôi đã cập nhật `testimonials.js` để bỏ `Content-Type` header (có thể gây preflight CORS request).

```bash
git add .
git commit -m "Remove Content-Type header to avoid CORS preflight"
git push origin main
```

---

## Bước 3: Test trên GitHub Pages

1. Đợi 2-3 phút
2. Mở Incognito mode
3. Truy cập `https://nhanhuutran007.github.io`
4. F12 → Console
5. Thử gửi testimonial

---

## ⚠️ NẾU VẪN KHÔNG HOẠT ĐỘNG

Google Apps Script có limitation với CORS cho POST requests. Chúng ta có 2 lựa chọn:

### Option 1: Dùng Google Forms (Đơn giản nhất)
- Tạo Google Form
- Embed form vào website
- Responses tự động lưu vào Google Sheets
- **Ưu điểm:** Không có CORS issues, dễ setup
- **Nhược điểm:** UI của Google, không custom được nhiều

### Option 2: Dùng dịch vụ khác
- **Formspree** (free tier: 50 submissions/month)
- **Netlify Forms** (nếu host trên Netlify)
- **EmailJS** (gửi qua email)

Bạn muốn thử option nào?
