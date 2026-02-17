# 🔍 DEBUG: Testimonials không hiển thị nội dung

## Vấn đề hiện tại:
- ✅ Form submission hoạt động
- ✅ Dữ liệu lưu vào Sheet
- ✅ Đã set `approved = TRUE`
- ❌ References section chỉ hiển thị icon quote (") nhưng không có nội dung

## Nguyên nhân có thể:

### 1. Tên sheet không khớp
Apps Script code đang dùng `SHEET_NAME = 'Sheet1'`

**Kiểm tra:** Mở Google Sheet, xem tên tab ở góc dưới bên trái

**Nếu tên khác** (ví dụ: "Trang tính1", "Portfolio Testimonials"):
1. Mở Apps Script Editor
2. Đổi dòng 20: `const SHEET_NAME = 'TÊN_THỰC_TẾ';`
3. Lưu (Ctrl+S)
4. Deploy → Manage deployments → Edit → New version → Deploy

### 2. Dữ liệu không đúng format
API có thể trả về empty data hoặc format sai

**Kiểm tra:** Mở `debug-display.html` trong browser:
1. Click "1. Test API"
2. Xem kết quả
3. Chụp màn hình và gửi cho tôi

### 3. JavaScript error
Có thể có lỗi khi parse hoặc display dữ liệu

**Kiểm tra:** Mở `https://nhanhuutran007.github.io`:
1. F12 → Console tab
2. Gõ: `loadTestimonials()`
3. Xem có lỗi gì không
4. Chụp màn hình Console

---

## 🎯 Hành động tiếp theo:

Hãy cho tôi biết **TÊN CHÍNH XÁC** của sheet tab trong Google Sheets (góc dưới bên trái).

Hoặc mở `debug-display.html` và gửi screenshot kết quả "Test API" cho tôi.
