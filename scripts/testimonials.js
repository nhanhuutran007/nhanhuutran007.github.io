// ===== JAVASCRIPT XỬ LÝ TESTIMONIALS =====
// File: testimonials.js

const API_URL = 'https://script.google.com/macros/s/AKfycbySeJhmoIi3vyhE3Ic7MgkLc5iplZ-z8RnmGA5BeL2u6p_Eq8ZA1JuCGmeZmWdI0BQG/exec';

// 2 card tĩnh mặc định luôn hiển thị ở slide đầu
const STATIC_CARDS = [
    {
        name: 'Ngọc Nhi',
        position: 'CTV / Designer',
        content: 'Nhan displays exemplary professionalism and is able to take on challenges. I love his.',
        avatar_url: 'images/reference-image-1.jpg'
    },
    {
        name: 'Mẹc siuu',
        position: 'Coder Part-Time / Web Designer',
        content: 'Nhan is a great co-worker and problem solver. He is quick to extend his helping hand and makes a good team player.',
        avatar_url: 'images/reference-image-2.jpg'
    }
];

/**
 * Tải testimonials từ database rồi render carousel thống nhất
 */
async function loadTestimonials() {
    let dynamicCards = [];

    try {
        const url = `${API_URL}?t=${Date.now()}`;
        const response = await fetch(url, { method: 'GET', redirect: 'follow' });
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
            dynamicCards = result.data;
        }
    } catch (error) {
        console.error('Lỗi khi tải testimonials:', error);
    }

    // Gộp: static cards trước, dynamic cards sau
    const allCards = [...STATIC_CARDS, ...dynamicCards];
    renderCarousel(allCards);
}

/**
 * Tạo HTML cho một testimonial card
 */
function makeCardHTML(card) {
    const avatar = card.avatar_url || 'images/default-avatar.svg';
    return `
        <div class="col-md-6 mb-3">
            <div class="testimonial-card h-100">
                <div class="d-flex mb-2">
                    <div class="avatar">
                        <img src="${avatar}" width="60" height="60"
                             alt="${escapeHtml(card.name)}"
                             onerror="this.src='images/default-avatar.svg'" />
                    </div>
                    <div style="margin-left:1rem;">
                        <h3 class="h6 mb-1 fw-bold">${escapeHtml(card.name)}</h3>
                        <p class="text-muted text-small mb-0">${escapeHtml(card.position)}</p>
                    </div>
                </div>
                <div class="d-flex">
                    <i class="text-secondary fas fa-quote-left quote-icon"></i>
                    <p class="lead mx-2 testimonial-text">${escapeHtml(card.content)}</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Render carousel thống nhất — 2 cards mỗi slide, tự động chuyển 5 giây
 * @param {Array} cards - Tất cả cards (static + dynamic)
 */
function renderCarousel(cards) {
    const container = document.getElementById('all-testimonials');
    if (!container) return;

    container.innerHTML = '';

    const carouselId = 'testimonialsCarousel';
    const itemsPerPage = 2;
    const totalPages = Math.ceil(cards.length / itemsPerPage);

    // ── Slides ────────────────────────────────────────────────────────────────
    let slidesHTML = '';
    for (let i = 0; i < totalPages; i++) {
        const page = cards.slice(i * itemsPerPage, Math.min((i + 1) * itemsPerPage, cards.length));
        slidesHTML += `<div class="carousel-item ${i === 0 ? 'active' : ''}"><div class="row">`;
        page.forEach(card => { slidesHTML += makeCardHTML(card); });
        slidesHTML += `</div></div>`;
    }

    // ── Navigation dots ───────────────────────────────────────────────────────
    let dotsHTML = '';
    for (let i = 0; i < totalPages; i++) {
        dotsHTML += `<span class="dot ${i === 0 ? 'active' : ''}"
                          data-bs-target="#${carouselId}"
                          data-bs-slide-to="${i}"
                          aria-label="Slide ${i + 1}"></span>`;
    }

    // ── Full carousel HTML ────────────────────────────────────────────────────
    const navHTML = totalPages > 1 ? `
        <div class="d-flex align-items-center justify-content-center gap-3 mt-4">
            <button class="testimonial-nav-btn" type="button"
                    data-bs-target="#${carouselId}" data-bs-slide="prev" aria-label="Previous">
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="testimonial-dots d-flex align-items-center">${dotsHTML}</div>
            <button class="testimonial-nav-btn" type="button"
                    data-bs-target="#${carouselId}" data-bs-slide="next" aria-label="Next">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    ` : '';

    container.innerHTML = `
        <div id="${carouselId}" class="carousel slide carousel-fade">
            <div class="carousel-inner">${slidesHTML}</div>
            ${navHTML}
        </div>
    `;

    // Khởi tạo Bootstrap Carousel thủ công (vì inject sau page load)
    const carouselEl = document.getElementById(carouselId);
    if (!carouselEl) return;

    const bsCarousel = new bootstrap.Carousel(carouselEl, {
        interval: 5000,
        ride: 'carousel',
        touch: true
    });

    // Wire nút prev / next
    container.querySelector('[aria-label="Previous"]')?.addEventListener('click', () => bsCarousel.prev());
    container.querySelector('[aria-label="Next"]')?.addEventListener('click', () => bsCarousel.next());

    // Wire dots
    container.querySelectorAll('.testimonial-dots .dot').forEach((dot, idx) => {
        dot.addEventListener('click', () => bsCarousel.to(idx));
    });

    // Sync dots khi slide chuyển
    carouselEl.addEventListener('slid.bs.carousel', function (e) {
        container.querySelectorAll('.testimonial-dots .dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === e.to);
        });
    });
}

/**
 * Gửi testimonial mới lên server
 */
async function submitTestimonial(data) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            redirect: 'follow',
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Lỗi khi gửi testimonial:', error);
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng thử lại sau.' };
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

    const data = {
        name: form.querySelector('#name').value.trim(),
        position: form.querySelector('#position').value.trim(),
        content: form.querySelector('#message').value.trim()
    };

    if (data.name.length < 2 || data.name.length > 100) {
        showMessage('Tên phải từ 2-100 ký tự', 'error'); return;
    }
    if (data.position.length < 2 || data.position.length > 100) {
        showMessage('Chức vụ phải từ 2-100 ký tự', 'error'); return;
    }
    if (data.content.length < 10 || data.content.length > 1000) {
        showMessage('Nội dung đánh giá phải từ 10-1000 ký tự', 'error'); return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Đang gửi...';

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
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
}

/**
 * Hiển thị thông báo cho user
 */
function showMessage(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    const form = document.querySelector('#contact form');
    form.insertBefore(alertDiv, form.firstChild);
    setTimeout(() => alertDiv.remove(), 5000);
}

/**
 * Escape HTML để tránh XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Khởi tạo khi DOM đã load
document.addEventListener('DOMContentLoaded', function () {
    // Luôn render carousel ngay (với static cards), sau đó load dynamic nếu có
    loadTestimonials();

    const form = document.querySelector('#contact form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});
