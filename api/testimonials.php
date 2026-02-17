&lt;?php
// ===== API XỬ LÝ TESTIMONIALS =====
// File: testimonials.php
// Mục đích: API endpoint để lấy và thêm testimonials

require_once 'config.php';

// Lấy request method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getTestimonials();
        break;
    case 'POST':
        addTestimonial();
        break;
    default:
        sendResponse(false, null, 'Method not allowed', 405);
}

/**
 * Lấy danh sách testimonials đã được duyệt
 */
function getTestimonials() {
    $conn = getDBConnection();
    
    if (!$conn) {
        sendResponse(false, null, 'Không thể kết nối database', 500);
    }
    
    // Chỉ lấy các testimonials đã được duyệt (is_approved = 1)
    $sql = "SELECT id, name, position, content, avatar_url, created_at 
            FROM testimonials 
            WHERE is_approved = 1 
            ORDER BY created_at DESC";
    
    $result = $conn->query($sql);
    
    if ($result === false) {
        $conn->close();
        sendResponse(false, null, 'Lỗi truy vấn database', 500);
    }
    
    $testimonials = [];
    while ($row = $result->fetch_assoc()) {
        $testimonials[] = $row;
    }
    
    $conn->close();
    sendResponse(true, $testimonials, 'Lấy danh sách testimonials thành công', 200);
}

/**
 * Thêm testimonial mới
 */
function addTestimonial() {
    // Lấy dữ liệu từ request body
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (!isset($input['name']) || !isset($input['position']) || !isset($input['content'])) {
        sendResponse(false, null, 'Thiếu thông tin bắt buộc (name, position, content)', 400);
    }
    
    $name = sanitizeInput($input['name']);
    $position = sanitizeInput($input['position']);
    $content = sanitizeInput($input['content']);
    
    // Validate độ dài
    if (strlen($name) < 2 || strlen($name) > 100) {
        sendResponse(false, null, 'Tên phải từ 2-100 ký tự', 400);
    }
    
    if (strlen($position) < 2 || strlen($position) > 100) {
        sendResponse(false, null, 'Chức vụ phải từ 2-100 ký tự', 400);
    }
    
    if (strlen($content) < 10 || strlen($content) > 1000) {
        sendResponse(false, null, 'Nội dung đánh giá phải từ 10-1000 ký tự', 400);
    }
    
    $conn = getDBConnection();
    
    if (!$conn) {
        sendResponse(false, null, 'Không thể kết nối database', 500);
    }
    
    // Prepare statement để tránh SQL injection
    $stmt = $conn->prepare("INSERT INTO testimonials (name, position, content, is_approved) VALUES (?, ?, ?, 0)");
    
    if (!$stmt) {
        $conn->close();
        sendResponse(false, null, 'Lỗi chuẩn bị câu lệnh SQL', 500);
    }
    
    $stmt->bind_param("sss", $name, $position, $content);
    
    if ($stmt->execute()) {
        $testimonialId = $stmt->insert_id;
        $stmt->close();
        $conn->close();
        
        sendResponse(true, [
            'id' => $testimonialId,
            'message' => 'Cảm ơn bạn đã gửi đánh giá! Đánh giá của bạn sẽ được hiển thị sau khi được duyệt.'
        ], 'Thêm testimonial thành công', 201);
    } else {
        $error = $stmt->error;
        $stmt->close();
        $conn->close();
        sendResponse(false, null, 'Lỗi khi thêm testimonial: ' . $error, 500);
    }
}
?&gt;
