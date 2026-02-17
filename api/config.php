&lt;?php
// ===== CẤU HÌNH KẾT NỐI MYSQL =====
// File: config.php
// Mục đích: Cấu hình kết nối database và các hàm tiện ích

// Cấu hình database
define('DB_SERVER', 'host80.vietnix.vn');
define('DB_USERNAME', 'githubio_admin');
define('DB_PASSWORD', 'nhanhuutran007');
define('DB_NAME', 'Portfolio');
define('DB_PORT', '3306');

// Cấu hình CORS (cho phép frontend gọi API)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Xử lý preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Tạo kết nối đến database MySQL
 * @return mysqli|null Trả về connection object hoặc null nếu lỗi
 */
function getDBConnection() {
    try {
        $conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_PORT);
        
        // Kiểm tra kết nối
        if ($conn->connect_error) {
            error_log("Database connection failed: " . $conn->connect_error);
            return null;
        }
        
        // Set charset UTF-8
        $conn->set_charset("utf8mb4");
        
        return $conn;
    } catch (Exception $e) {
        error_log("Database connection exception: " . $e->getMessage());
        return null;
    }
}

/**
 * Trả về JSON response
 * @param bool $success Trạng thái thành công
 * @param mixed $data Dữ liệu trả về
 * @param string $message Thông báo
 * @param int $code HTTP status code
 */
function sendResponse($success, $data = null, $message = '', $code = 200) {
    http_response_code($code);
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Validate và sanitize input
 * @param string $data Dữ liệu cần xử lý
 * @return string Dữ liệu đã được làm sạch
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}
?&gt;
