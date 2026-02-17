&lt;?php
// ===== ADMIN PANEL ĐƠN GIẢN =====
// File: admin.php
// Mục đích: Quản lý testimonials (duyệt, xóa)

require_once 'config.php';

// Simple authentication (thay đổi username/password)
$ADMIN_USERNAME = 'admin';
$ADMIN_PASSWORD = 'nhanhuutran007'; // Nên thay đổi password này!

session_start();

// Xử lý login
if ($_SERVER['REQUEST_METHOD'] === 'POST' &amp;&amp; isset($_POST['login'])) {
    if ($_POST['username'] === $ADMIN_USERNAME &amp;&amp; $_POST['password'] === $ADMIN_PASSWORD) {
        $_SESSION['admin_logged_in'] = true;
        header('Location: admin.php');
        exit();
    } else {
        $error = 'Sai tên đăng nhập hoặc mật khẩu!';
    }
}

// Xử lý logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit();
}

// Kiểm tra đăng nhập
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    // Hiển thị form login
    ?&gt;
    &lt;!DOCTYPE html&gt;
    &lt;html lang="vi"&gt;
    &lt;head&gt;
        &lt;meta charset="UTF-8"&gt;
        &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
        &lt;title&gt;Admin Login - Testimonials&lt;/title&gt;
        &lt;link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"&gt;
    &lt;/head&gt;
    &lt;body class="bg-light"&gt;
        &lt;div class="container"&gt;
            &lt;div class="row justify-content-center mt-5"&gt;
                &lt;div class="col-md-4"&gt;
                    &lt;div class="card shadow"&gt;
                        &lt;div class="card-body"&gt;
                            &lt;h3 class="card-title text-center mb-4"&gt;Admin Login&lt;/h3&gt;
                            &lt;?php if (isset($error)): ?&gt;
                                &lt;div class="alert alert-danger"&gt;&lt;?php echo $error; ?&gt;&lt;/div&gt;
                            &lt;?php endif; ?&gt;
                            &lt;form method="POST"&gt;
                                &lt;div class="mb-3"&gt;
                                    &lt;label class="form-label"&gt;Username&lt;/label&gt;
                                    &lt;input type="text" name="username" class="form-control" required&gt;
                                &lt;/div&gt;
                                &lt;div class="mb-3"&gt;
                                    &lt;label class="form-label"&gt;Password&lt;/label&gt;
                                    &lt;input type="password" name="password" class="form-control" required&gt;
                                &lt;/div&gt;
                                &lt;button type="submit" name="login" class="btn btn-primary w-100"&gt;Đăng nhập&lt;/button&gt;
                            &lt;/form&gt;
                        &lt;/div&gt;
                    &lt;/div&gt;
                &lt;/div&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/body&gt;
    &lt;/html&gt;
    &lt;?php
    exit();
}

// Xử lý actions (approve, delete)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $conn = getDBConnection();
    
    if (isset($_POST['approve'])) {
        $id = intval($_POST['id']);
        $stmt = $conn-&gt;prepare("UPDATE testimonials SET is_approved = 1 WHERE id = ?");
        $stmt-&gt;bind_param("i", $id);
        $stmt-&gt;execute();
        $stmt-&gt;close();
        $success = "Đã duyệt testimonial #$id";
    }
    
    if (isset($_POST['delete'])) {
        $id = intval($_POST['id']);
        $stmt = $conn-&gt;prepare("DELETE FROM testimonials WHERE id = ?");
        $stmt-&gt;bind_param("i", $id);
        $stmt-&gt;execute();
        $stmt-&gt;close();
        $success = "Đã xóa testimonial #$id";
    }
    
    if (isset($_POST['unapprove'])) {
        $id = intval($_POST['id']);
        $stmt = $conn-&gt;prepare("UPDATE testimonials SET is_approved = 0 WHERE id = ?");
        $stmt-&gt;bind_param("i", $id);
        $stmt-&gt;execute();
        $stmt-&gt;close();
        $success = "Đã ẩn testimonial #$id";
    }
    
    $conn-&gt;close();
}

// Lấy danh sách testimonials
$conn = getDBConnection();
$result = $conn-&gt;query("SELECT * FROM testimonials ORDER BY created_at DESC");
$testimonials = [];
while ($row = $result-&gt;fetch_assoc()) {
    $testimonials[] = $row;
}
$conn-&gt;close();
?&gt;

&lt;!DOCTYPE html&gt;
&lt;html lang="vi"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;Quản lý Testimonials&lt;/title&gt;
    &lt;link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"&gt;
    &lt;link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"&gt;
    &lt;style&gt;
        .testimonial-card {
            transition: all 0.3s;
        }
        .testimonial-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .badge-pending {
            background-color: #ffc107;
        }
        .badge-approved {
            background-color: #28a745;
        }
    &lt;/style&gt;
&lt;/head&gt;
&lt;body class="bg-light"&gt;
    &lt;nav class="navbar navbar-dark bg-dark"&gt;
        &lt;div class="container-fluid"&gt;
            &lt;span class="navbar-brand mb-0 h1"&gt;
                &lt;i class="fas fa-comments"&gt;&lt;/i&gt; Quản lý Testimonials
            &lt;/span&gt;
            &lt;a href="?logout" class="btn btn-outline-light btn-sm"&gt;
                &lt;i class="fas fa-sign-out-alt"&gt;&lt;/i&gt; Đăng xuất
            &lt;/a&gt;
        &lt;/div&gt;
    &lt;/nav&gt;

    &lt;div class="container mt-4"&gt;
        &lt;?php if (isset($success)): ?&gt;
            &lt;div class="alert alert-success alert-dismissible fade show"&gt;
                &lt;?php echo $success; ?&gt;
                &lt;button type="button" class="btn-close" data-bs-dismiss="alert"&gt;&lt;/button&gt;
            &lt;/div&gt;
        &lt;?php endif; ?&gt;

        &lt;div class="row mb-4"&gt;
            &lt;div class="col-md-3"&gt;
                &lt;div class="card text-center"&gt;
                    &lt;div class="card-body"&gt;
                        &lt;h5 class="card-title"&gt;Tổng số&lt;/h5&gt;
                        &lt;h2&gt;&lt;?php echo count($testimonials); ?&gt;&lt;/h2&gt;
                    &lt;/div&gt;
                &lt;/div&gt;
            &lt;/div&gt;
            &lt;div class="col-md-3"&gt;
                &lt;div class="card text-center"&gt;
                    &lt;div class="card-body"&gt;
                        &lt;h5 class="card-title"&gt;Đã duyệt&lt;/h5&gt;
                        &lt;h2 class="text-success"&gt;
                            &lt;?php echo count(array_filter($testimonials, fn($t) =&gt; $t['is_approved'] == 1)); ?&gt;
                        &lt;/h2&gt;
                    &lt;/div&gt;
                &lt;/div&gt;
            &lt;/div&gt;
            &lt;div class="col-md-3"&gt;
                &lt;div class="card text-center"&gt;
                    &lt;div class="card-body"&gt;
                        &lt;h5 class="card-title"&gt;Chờ duyệt&lt;/h5&gt;
                        &lt;h2 class="text-warning"&gt;
                            &lt;?php echo count(array_filter($testimonials, fn($t) =&gt; $t['is_approved'] == 0)); ?&gt;
                        &lt;/h2&gt;
                    &lt;/div&gt;
                &lt;/div&gt;
            &lt;/div&gt;
        &lt;/div&gt;

        &lt;div class="card shadow"&gt;
            &lt;div class="card-header bg-primary text-white"&gt;
                &lt;h5 class="mb-0"&gt;&lt;i class="fas fa-list"&gt;&lt;/i&gt; Danh sách Testimonials&lt;/h5&gt;
            &lt;/div&gt;
            &lt;div class="card-body"&gt;
                &lt;?php if (empty($testimonials)): ?&gt;
                    &lt;p class="text-center text-muted"&gt;Chưa có testimonial nào.&lt;/p&gt;
                &lt;?php else: ?&gt;
                    &lt;div class="row"&gt;
                        &lt;?php foreach ($testimonials as $testimonial): ?&gt;
                            &lt;div class="col-md-6 mb-3"&gt;
                                &lt;div class="card testimonial-card h-100"&gt;
                                    &lt;div class="card-body"&gt;
                                        &lt;div class="d-flex justify-content-between align-items-start mb-2"&gt;
                                            &lt;div&gt;
                                                &lt;h5 class="card-title mb-1"&gt;
                                                    &lt;?php echo htmlspecialchars($testimonial['name']); ?&gt;
                                                &lt;/h5&gt;
                                                &lt;p class="text-muted small mb-0"&gt;
                                                    &lt;?php echo htmlspecialchars($testimonial['position']); ?&gt;
                                                &lt;/p&gt;
                                            &lt;/div&gt;
                                            &lt;span class="badge &lt;?php echo $testimonial['is_approved'] ? 'badge-approved' : 'badge-pending'; ?&gt;"&gt;
                                                &lt;?php echo $testimonial['is_approved'] ? 'Đã duyệt' : 'Chờ duyệt'; ?&gt;
                                            &lt;/span&gt;
                                        &lt;/div&gt;
                                        &lt;p class="card-text"&gt;
                                            &lt;?php echo nl2br(htmlspecialchars($testimonial['content'])); ?&gt;
                                        &lt;/p&gt;
                                        &lt;p class="text-muted small mb-3"&gt;
                                            &lt;i class="far fa-clock"&gt;&lt;/i&gt; 
                                            &lt;?php echo date('d/m/Y H:i', strtotime($testimonial['created_at'])); ?&gt;
                                        &lt;/p&gt;
                                        &lt;div class="btn-group w-100"&gt;
                                            &lt;?php if ($testimonial['is_approved']): ?&gt;
                                                &lt;form method="POST" class="flex-fill"&gt;
                                                    &lt;input type="hidden" name="id" value="&lt;?php echo $testimonial['id']; ?&gt;"&gt;
                                                    &lt;button type="submit" name="unapprove" class="btn btn-warning btn-sm w-100"&gt;
                                                        &lt;i class="fas fa-eye-slash"&gt;&lt;/i&gt; Ẩn
                                                    &lt;/button&gt;
                                                &lt;/form&gt;
                                            &lt;?php else: ?&gt;
                                                &lt;form method="POST" class="flex-fill"&gt;
                                                    &lt;input type="hidden" name="id" value="&lt;?php echo $testimonial['id']; ?&gt;"&gt;
                                                    &lt;button type="submit" name="approve" class="btn btn-success btn-sm w-100"&gt;
                                                        &lt;i class="fas fa-check"&gt;&lt;/i&gt; Duyệt
                                                    &lt;/button&gt;
                                                &lt;/form&gt;
                                            &lt;?php endif; ?&gt;
                                            &lt;form method="POST" class="flex-fill" onsubmit="return confirm('Bạn có chắc muốn xóa?')"&gt;
                                                &lt;input type="hidden" name="id" value="&lt;?php echo $testimonial['id']; ?&gt;"&gt;
                                                &lt;button type="submit" name="delete" class="btn btn-danger btn-sm w-100"&gt;
                                                    &lt;i class="fas fa-trash"&gt;&lt;/i&gt; Xóa
                                                &lt;/button&gt;
                                            &lt;/form&gt;
                                        &lt;/div&gt;
                                    &lt;/div&gt;
                                &lt;/div&gt;
                            &lt;/div&gt;
                        &lt;?php endforeach; ?&gt;
                    &lt;/div&gt;
                &lt;?php endif; ?&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/div&gt;

    &lt;script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
