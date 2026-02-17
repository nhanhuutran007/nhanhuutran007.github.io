// ===== JAVASCRIPT XỬ LÝ TESTIMONIALS =====
// File: testimonials.js
// Mục đích: Xử lý gửi và hiển thị testimonials từ Google Sheets

// ⚠️ QUAN TRỌNG: Thay đổi URL này sau khi deploy Google Apps Script
// Sau khi deploy Apps Script, bạn sẽ nhận được URL dạng:
// https://script.google.com/macros/s/AKfycby.../exec
// Paste URL đó vào đây:
const API_URL = 'https://script.google.com/macros/s/AKfycbyNikXWfkkew9O8kT957_JH8fytrxDnP-_J4ZqLd60XcOBTsSNzQeBgBGJB17r4UVCn/exec';

// Nếu chưa có URL, để tạm như này để test (sẽ báo lỗi)
// const API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

/**
 * Tải và hiển thị testimonials từ database
 */
async function loadTestimonials() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
            displayTestimonials(result.data);
        } else {
            console.log('Chưa có testimonials nào được duyệt');
        }
    } catch (error) {
        console.error('Lỗi khi tải testimonials:', error);
        // Giữ nguyên testimonials mặc định trong HTML nếu không tải được từ DB
    }
}

/**
 * Hiển thị testimonials lên trang
 * @param {Array} testimonials - Mảng các testimonial objects
 */
function displayTestimonials(testimonials) {
    const container = document.querySelector('#references .row');

    if (!container) {
        console.error('Không tìm thấy container để hiển thị testimonials');
        return;
    }

    // Xóa nội dung cũ
    container.innerHTML = '';

    // Tạo HTML cho mỗi testimonial
    testimonials.forEach((testimonial, index) => {
        const delay = index * 100; // Animation delay
        const avatarUrl = testimonial.avatar_url || 'images/default-avatar.jpg';

        const testimonialHTML = `
            <div class="col-md-6">
                <div class="d-flex mb-2">
                    <div class="avatar">
                        <img src="${avatarUrl}" width="60" height="60" alt="${testimonial.name}" 
                             onerror="this.src='images/default-avatar.jpg'" />
                    </div>
                    <div class="header-bio m-3 mb-0">
                        <h3 class="h6 mb-1" data-aos="fade-left" data-aos-delay="${delay}">
                            ${escapeHtml(testimonial.name)}
                        </h3>
                        <p class="text-muted text-small" data-aos="fade-left" data-aos-delay="${delay + 100}">
                            ${escapeHtml(testimonial.position)}
                        </p>
                    </div>
                </div>
                <div class="d-flex">
                    <i class="text-secondary fas fa-quote-left"></i>
                    <p class="lead mx-2" data-aos="fade-left" data-aos-delay="${delay + 100}">
                        ${escapeHtml(testimonial.content)}
                    </p>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', testimonialHTML);
    });

    // Refresh AOS animations nếu có
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

/**
 * Gửi testimonial mới lên server
 * @param {Object} data - Object chứa name, position, content
 */
async function submitTestimonial(data) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Lỗi khi gửi testimonial:', error);
        return {
            success: false,
            message: 'Không thể kết nối đến server. Vui lòng thử lại sau.'
        };
    }
}

/**
 * Xử lý submit form
 */
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    // Lấy dữ liệu từ form
    const data = {
        name: form.querySelector('#name').value.trim(),
        position: form.querySelector('#position').value.trim(),
        content: form.querySelector('#message').value.trim()
    };

    // Validate phía client
    if (data.name.length < 2 || data.name.length > 100) {
        showMessage('Tên phải từ 2-100 ký tự', 'error');
        return;
    }

    if (data.position.length < 2 || data.position.length > 100) {
        showMessage('Chức vụ phải từ 2-100 ký tự', 'error');
        return;
    }

    if (data.content.length < 10 || data.content.length > 1000) {
        showMessage('Nội dung đánh giá phải từ 10-1000 ký tự', 'error');
        return;
    }

    // Disable button và hiển thị loading
    submitButton.disabled = true;
    submitButton.textContent = 'Đang gửi...';

    // Gửi dữ liệu
    submitTestimonial(data)
        .then(result => {
            if (result.success) {
                showMessage(result.data.message || 'Cảm ơn bạn đã gửi đánh giá!', 'success');
                form.reset();
            } else {
                showMessage(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'error');
            }
        })
        .finally(() => {
            // Enable button trở lại
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
}

/**
 * Hiển thị thông báo cho user
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại thông báo: 'success' hoặc 'error'
 */
function showMessage(message, type = 'info') {
    // Tạo element thông báo
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Thêm vào form
    const form = document.querySelector('#contact form');
    form.insertBefore(alertDiv, form.firstChild);

    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

/**
 * Escape HTML để tránh XSS
 * @param {string} text - Text cần escape
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Khởi tạo khi DOM đã load
document.addEventListener('DOMContentLoaded', function () {
    // Tải testimonials từ database
    loadTestimonials();

    // Gắn event listener cho form
    const form = document.querySelector('#contact form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});
