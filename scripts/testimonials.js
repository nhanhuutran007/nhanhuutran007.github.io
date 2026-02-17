// ===== JAVASCRIPT XỬ LÝ TESTIMONIALS =====
// File: testimonials.js
// Mục đích: Xử lý gửi và hiển thị testimonials từ Google Sheets

// ⚠️ QUAN TRỌNG: Thay đổi URL này sau khi deploy Google Apps Script
// Sau khi deploy Apps Script, bạn sẽ nhận được URL dạng:
// https://script.google.com/macros/s/AKfycby.../exec
// Paste URL đó vào đây:
const API_URL = 'https://script.google.com/macros/s/AKfycbySeJhmoIi3vyhE3Ic7MgkLc5iplZ-z8RnmGA5BeL2u6p_Eq8ZA1JuCGmeZmWdI0BQG/exec';

// Nếu chưa có URL, để tạm như này để test (sẽ báo lỗi)
// const API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

/**
 * Tải và hiển thị testimonials từ database
 */
async function loadTestimonials() {
    try {
        // Sử dụng URL với timestamp để tránh cache
        const url = `${API_URL}?t=${Date.now()}`;

        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow'
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
 * Hiển thị testimonials lên trang với carousel (2 items mỗi lần)
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

    if (testimonials.length === 0) {
        container.innerHTML = '<p class="text-muted">Chưa có đánh giá nào.</p>';
        return;
    }

    // Tạo carousel wrapper
    const carouselId = 'testimonialsCarousel';
    const itemsPerPage = 2;
    const totalPages = Math.ceil(testimonials.length / itemsPerPage);

    let carouselHTML = `
        <div id="${carouselId}" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000" data-bs-touch="true" style="width: 100%;">
            <div class="carousel-inner" style="min-height: 200px;">
    `;

    // Tạo carousel items (mỗi item chứa 2 testimonials)
    for (let i = 0; i < totalPages; i++) {
        const start = i * itemsPerPage;
        const end = Math.min(start + itemsPerPage, testimonials.length);
        const pageTestimonials = testimonials.slice(start, end);

        carouselHTML += `
            <div class="carousel-item ${i === 0 ? 'active' : ''}">
                <div class="row">
        `;

        pageTestimonials.forEach(testimonial => {
            const avatarUrl = testimonial.avatar_url || 'images/default-avatar.svg';

            carouselHTML += `
                <div class="col-md-6 mb-3">
                    <div class="testimonial-card h-100">
                        <div class="d-flex mb-3">
                            <div class="avatar">
                                <img src="${avatarUrl}" width="60" height="60" alt="${escapeHtml(testimonial.name)}" 
                                     onerror="this.src='images/default-avatar.svg'" 
                                     style="object-fit: cover;" />
                            </div>
                            <div class="header-bio ms-3 mb-0">
                                <h3 class="h6 mb-1 fw-bold">
                                    ${escapeHtml(testimonial.name)}
                                </h3>
                                <p class="text-muted text-small mb-0">
                                    ${escapeHtml(testimonial.position)}
                                </p>
                            </div>
                        </div>
                        <div class="d-flex">
                            <i class="text-primary fas fa-quote-left me-2" style="font-size: 1.5rem; opacity: 0.3;"></i>
                            <p class="lead mb-0" style="font-size: 1rem; line-height: 1.6;">
                                ${escapeHtml(testimonial.content)}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        });

        carouselHTML += `
                </div>
            </div>
        `;
    }

    carouselHTML += `
            </div>
    `;

    // Chỉ hiển thị controls nếu có nhiều hơn 1 trang
    if (totalPages > 1) {
        // Pagination dots (đẹp hơn)
        carouselHTML += `
            <div class="carousel-indicators position-relative mt-4 mb-0" style="position: static !important;">
        `;

        for (let i = 0; i < totalPages; i++) {
            carouselHTML += `
                <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${i}" 
                        ${i === 0 ? 'class="active" aria-current="true"' : ''} 
                        aria-label="Slide ${i + 1}"
                        style="width: 24px; height: 3px; border-radius: 2px; margin: 0 4px; opacity: ${i === 0 ? '1' : '0.3'}; background-color: #6c757d; border: none;"></button>
            `;
        }

        carouselHTML += `
            </div>
        `;

        // Navigation buttons (nhỏ hơn, tinh tế hơn)
        carouselHTML += `
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev" 
                    style="width: 35px; height: 35px; top: 50%; transform: translateY(-50%); left: -45px; opacity: 0.4; transition: opacity 0.3s; background-color: rgba(108, 117, 125, 0.1); border-radius: 50%; border: 1px solid rgba(108, 117, 125, 0.2);" 
                    onmouseover="this.style.opacity='0.8'" 
                    onmouseout="this.style.opacity='0.4'">
                <span class="carousel-control-prev-icon" aria-hidden="true" 
                      style="filter: invert(0.5); background-size: 50%; width: 16px; height: 16px;"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next" 
                    style="width: 35px; height: 35px; top: 50%; transform: translateY(-50%); right: -45px; opacity: 0.4; transition: opacity 0.3s; background-color: rgba(108, 117, 125, 0.1); border-radius: 50%; border: 1px solid rgba(108, 117, 125, 0.2);" 
                    onmouseover="this.style.opacity='0.8'" 
                    onmouseout="this.style.opacity='0.4'">
                <span class="carousel-control-next-icon" aria-hidden="true" 
                      style="filter: invert(0.5); background-size: 50%; width: 16px; height: 16px;"></span>
                <span class="visually-hidden">Next</span>
            </button>
        `;
    }

    carouselHTML += `
        </div>
    `;

    container.innerHTML = carouselHTML;
}

/**
 * Gửi testimonial mới lên server
 * @param {Object} data - Object chứa name, position, content
 */
async function submitTestimonial(data) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            redirect: 'follow',
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
