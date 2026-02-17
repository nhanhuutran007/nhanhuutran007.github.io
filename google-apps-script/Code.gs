/**
 * ===== GOOGLE APPS SCRIPT - TESTIMONIALS API =====
 * File: Code.gs (paste vào Google Apps Script Editor)
 * Mục đích: API endpoint để lưu và lấy testimonials từ Google Sheets
 * 
 * HƯỚNG DẪN SETUP:
 * 1. Tạo Google Sheet với tên "Portfolio Testimonials"
 * 2. Tạo header row (dòng 1):
 *    A1: timestamp | B1: name | C1: position | D1: content | E1: approved
 * 3. Vào Extensions > Apps Script
 * 4. Paste toàn bộ code này vào
 * 5. Click Deploy > New deployment
 * 6. Chọn type: Web app
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Deploy và copy Web App URL
 */

// Tên sheet (có thể thay đổi nếu bạn đặt tên khác)
const SHEET_NAME = 'Sheet1'; // Đổi thành tên sheet của bạn

/**
 * Xử lý GET request - Lấy testimonials đã duyệt
 */
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return createResponse(false, null, 'Sheet not found: ' + SHEET_NAME);
    }
    
    // Lấy tất cả dữ liệu
    const data = sheet.getDataRange().getValues();
    
    // Bỏ qua header row (dòng 0)
    const headers = data[0];
    const rows = data.slice(1);
    
    // Tìm index của các cột
    const timestampIndex = headers.indexOf('timestamp');
    const nameIndex = headers.indexOf('name');
    const positionIndex = headers.indexOf('position');
    const contentIndex = headers.indexOf('content');
    const approvedIndex = headers.indexOf('approved');
    
    // Lọc và format testimonials đã duyệt
    const testimonials = rows
      .filter(row => row[approvedIndex] === true || row[approvedIndex] === 'TRUE')
      .map((row, index) => ({
        id: index + 2, // Row number (bắt đầu từ 2 vì có header)
        name: row[nameIndex] || '',
        position: row[positionIndex] || '',
        content: row[contentIndex] || '',
        created_at: row[timestampIndex] || '',
        avatar_url: null
      }))
      .reverse(); // Mới nhất lên đầu
    
    return createResponse(true, testimonials, 'Lấy danh sách testimonials thành công');
    
  } catch (error) {
    return createResponse(false, null, 'Lỗi: ' + error.message);
  }
}

/**
 * Xử lý POST request - Thêm testimonial mới
 */
function doPost(e) {
  try {
    // Parse JSON từ request body
    const data = JSON.parse(e.postData.contents);
    
    // Validate input
    if (!data.name || !data.position || !data.content) {
      return createResponse(false, null, 'Thiếu thông tin bắt buộc (name, position, content)');
    }
    
    const name = String(data.name).trim();
    const position = String(data.position).trim();
    const content = String(data.content).trim();
    
    // Validate độ dài
    if (name.length < 2 || name.length > 100) {
      return createResponse(false, null, 'Tên phải từ 2-100 ký tự');
    }
    
    if (position.length < 2 || position.length > 100) {
      return createResponse(false, null, 'Chức vụ phải từ 2-100 ký tự');
    }
    
    if (content.length < 10 || content.length > 1000) {
      return createResponse(false, null, 'Nội dung đánh giá phải từ 10-1000 ký tự');
    }
    
    // Lấy sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return createResponse(false, null, 'Sheet not found: ' + SHEET_NAME);
    }
    
    // Thêm dòng mới
    const timestamp = new Date();
    const approved = false; // Mặc định chưa duyệt
    
    sheet.appendRow([
      timestamp,
      name,
      position,
      content,
      approved
    ]);
    
    return createResponse(
      true,
      {
        id: sheet.getLastRow(),
        message: 'Cảm ơn bạn đã gửi đánh giá! Đánh giá của bạn sẽ được hiển thị sau khi được duyệt.'
      },
      'Thêm testimonial thành công'
    );
    
  } catch (error) {
    return createResponse(false, null, 'Lỗi: ' + error.message);
  }
}

/**
 * Tạo JSON response
 * CORS được xử lý tự động bởi Apps Script khi deploy với "Anyone" access
 */
function createResponse(success, data, message) {
  const response = {
    success: success,
    data: data,
    message: message
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - Chạy để kiểm tra sheet có hoạt động không
 */
function testSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    Logger.log('ERROR: Sheet not found: ' + SHEET_NAME);
    Logger.log('Available sheets: ' + SpreadsheetApp.getActiveSpreadsheet().getSheets().map(s => s.getName()).join(', '));
    return;
  }
  
  Logger.log('Sheet found: ' + sheet.getName());
  Logger.log('Last row: ' + sheet.getLastRow());
  Logger.log('Headers: ' + sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].join(', '));
}
