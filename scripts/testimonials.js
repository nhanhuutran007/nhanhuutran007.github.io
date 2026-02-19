const API_URL = 'https://script.google.com/macros/s/AKfycbySeJhmoIi3vyhE3Ic7MgkLc5iplZ-z8RnmGA5BeL2u6p_Eq8ZA1JuCGmeZmWdI0BQG/exec';

const STATIC_CARDS = [
    {
        name: 'Ngoc Nhi',
        position: 'Collaborator / Designer',
        content: 'Nhan demonstrates exemplary professionalism and consistently rises to meet every challenge. His dedication and positive attitude make him a pleasure to work with.',
        avatar_url: 'images/reference-image-1.jpg'
    },
    {
        name: 'Huu Phuc',
        position: 'Part-Time Coder / Web Designer',
        content: 'Nhan is an outstanding co-worker and a natural problem solver. He is always ready to lend a hand and truly elevates the team with his collaborative spirit.',
        avatar_url: 'images/reference-image-2.jpg'
    }
];

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
        console.error('Failed to load testimonials:', error);
    }

    const allCards = [...STATIC_CARDS, ...dynamicCards];
    renderCarousel(allCards);
}

function makeCardHTML(card) {
    const avatar = card.avatar_url || 'images/default-avatar.svg';
    return `
        <div class="col-md-6 mb-3">
            <div class="testimonial-card h-100">
                <div class="d-flex align-items-center mb-3">
                    <div class="avatar flex-shrink-0">
                        <img src="${avatar}" width="52" height="52"
                             alt="${escapeHtml(card.name)}"
                             onerror="this.src='images/default-avatar.svg'" />
                    </div>
                    <div style="margin-left:0.9rem;">
                        <h3 class="h6 mb-0 fw-bold">${escapeHtml(card.name)}</h3>
                        <p class="text-muted text-small mb-0">${escapeHtml(card.position)}</p>
                        <div style="color:#f5a623;font-size:0.7rem;margin-top:2px;">
                            &#9733;&#9733;&#9733;&#9733;&#9733;
                        </div>
                    </div>
                </div>
                <div class="d-flex align-items-start">
                    <i class="text-secondary fas fa-quote-left quote-icon"></i>
                    <p class="mx-2 mb-0 testimonial-text">${escapeHtml(card.content)}</p>
                </div>
            </div>
        </div>
    `;
}

function renderCarousel(cards) {
    const container = document.getElementById('all-testimonials');
    if (!container) return;

    container.innerHTML = '';

    const carouselId = 'testimonialsCarousel';
    const itemsPerPage = 2;
    const totalPages = Math.ceil(cards.length / itemsPerPage);

    let slidesHTML = '';
    for (let i = 0; i < totalPages; i++) {
        const page = cards.slice(i * itemsPerPage, Math.min((i + 1) * itemsPerPage, cards.length));
        slidesHTML += `<div class="carousel-item ${i === 0 ? 'active' : ''}"><div class="row">`;
        page.forEach(card => { slidesHTML += makeCardHTML(card); });
        slidesHTML += `</div></div>`;
    }

    let dotsHTML = '';
    for (let i = 0; i < totalPages; i++) {
        dotsHTML += `<span class="dot ${i === 0 ? 'active' : ''}"
                          data-bs-target="#${carouselId}"
                          data-bs-slide-to="${i}"
                          aria-label="Slide ${i + 1}"></span>`;
    }

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

    const carouselEl = document.getElementById(carouselId);
    if (!carouselEl) return;

    const bsCarousel = new bootstrap.Carousel(carouselEl, {
        interval: 5000,
        ride: 'carousel',
        touch: true
    });

    container.querySelector('[aria-label="Previous"]')?.addEventListener('click', () => bsCarousel.prev());
    container.querySelector('[aria-label="Next"]')?.addEventListener('click', () => bsCarousel.next());

    container.querySelectorAll('.testimonial-dots .dot').forEach((dot, idx) => {
        dot.addEventListener('click', () => bsCarousel.to(idx));
    });

    carouselEl.addEventListener('slid.bs.carousel', function (e) {
        container.querySelectorAll('.testimonial-dots .dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === e.to);
        });
    });
}

async function submitTestimonial(data) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            redirect: 'follow',
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to submit testimonial:', error);
        return { success: false, message: 'Unable to connect to the server. Please try again later.' };
    }
}

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
        showMessage('Name must be between 2 and 100 characters.', 'error'); return;
    }
    if (data.position.length < 2 || data.position.length > 100) {
        showMessage('Role / position must be between 2 and 100 characters.', 'error'); return;
    }
    if (data.content.length < 10 || data.content.length > 1000) {
        showMessage('Review must be between 10 and 1000 characters.', 'error'); return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    submitTestimonial(data)
        .then(result => {
            if (result.success) {
                showMessage(result.data.message || 'Thank you for your review!', 'success');
                form.reset();
            } else {
                showMessage(result.message || 'Something went wrong. Please try again.', 'error');
            }
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
}

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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', function () {
    loadTestimonials();

    const form = document.querySelector('#contact form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});
