// ========================================
// CONFIGURATION
// ========================================
const RELATIONSHIP_START_DATE = new Date('2025-02-02'); // Ngày bắt đầu yêu nhau: 2/2/2025
const LOVE_MESSAGE = `Em yêu của anh,

Trong ngày Valentine này, anh muốn nói với em rằng:
Em là người con gái anh yêu nhất,
Là nụ cười làm anh quên đi mọi buồn phiền,
Là lý do khiến mỗi ngày của anh trở nên ý nghĩa hơn.

Anh yêu em nhiều lắm! ❤️`;

// ========================================
// PARTICLE SYSTEM
// ========================================
const particleCanvas = document.getElementById('particleCanvas');
const particleCtx = particleCanvas.getContext('2d');

particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

class FloatingParticle {
    constructor() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `rgba(255, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 0.5)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
    }

    draw() {
        particleCtx.fillStyle = this.color;
        particleCtx.beginPath();
        particleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        particleCtx.fill();
    }
}

const particles = [];
for (let i = 0; i < 100; i++) {
    particles.push(new FloatingParticle());
}

function animateParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                particleCtx.strokeStyle = `rgba(255, 182, 193, ${0.2 * (1 - distance / 100)})`;
                particleCtx.lineWidth = 1;
                particleCtx.beginPath();
                particleCtx.moveTo(p1.x, p1.y);
                particleCtx.lineTo(p2.x, p2.y);
                particleCtx.stroke();
            }
        });
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// ========================================
// FALLING HEARTS
// ========================================
function createFallingHearts() {
    const heartsContainer = document.getElementById('heartsContainer');
    const heartSymbols = ['❤️', '💕', '💖', '💗', '💝', '💓', '💞', '💟'];

    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';

        heartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 7000);
    }, 300);
}

// ========================================
// COUNTDOWN TIMER
// ========================================
function updateCountdown() {
    const now = new Date();
    const diff = now - RELATIONSHIP_START_DATE;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ========================================
// TYPING EFFECT
// ========================================
function typeWriter(text, element, speed = 50) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

const typingText = document.getElementById('typingText');
setTimeout(() => {
    typeWriter(LOVE_MESSAGE, typingText, 50);
}, 1000);

// ========================================
// LOVE LETTER ENVELOPE
// ========================================
const envelope = document.getElementById('envelope');
const letterContent = document.getElementById('letterContent');
let letterOpened = false;

envelope.addEventListener('click', function () {
    if (!letterOpened) {
        envelope.classList.add('open');
        setTimeout(() => {
            letterContent.classList.add('show');
        }, 500);
        letterOpened = true;
        createHeartExplosion(envelope);
    }
});

// Close letter when clicking outside
letterContent.addEventListener('click', function (e) {
    if (e.target === letterContent) {
        letterContent.classList.remove('show');
        envelope.classList.remove('open');
        letterOpened = false;
    }
});

// SURPRISE BUTTON
// ========================================
const surpriseButton = document.getElementById('surpriseButton');
const surpriseMessage = document.getElementById('surpriseMessage');
const valentineVideo = document.getElementById('valentineVideo');
let surpriseShown = false;

surpriseButton.addEventListener('click', function () {
    if (!surpriseShown) {
        surpriseMessage.classList.add('show');
        surpriseButton.querySelector('.button-text').textContent = '🎉 Em đã mở quà rồi! 🎉';
        surpriseShown = true;

        // Trigger fireworks
        launchFireworks();

        // Create explosion of hearts
        createHeartExplosion(surpriseButton);

        // Animate love meter
        animateLoveMeter();

        // Autoplay video
        setTimeout(() => {
            if (valentineVideo) {
                valentineVideo.play().catch(err => {
                    console.log('Video autoplay prevented:', err);
                });
            }
        }, 500);
    }
});



// ========================================
// HEART EXPLOSION EFFECT
// ========================================
function createHeartExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.textContent = '💖';
        heart.style.position = 'fixed';
        heart.style.left = centerX + 'px';
        heart.style.top = centerY + 'px';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.transition = 'all 1s ease-out';

        document.body.appendChild(heart);

        setTimeout(() => {
            const angle = (Math.PI * 2 * i) / 30;
            const distance = Math.random() * 200 + 100;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            heart.style.transform = `translate(${x}px, ${y}px) scale(0) rotate(${Math.random() * 360}deg)`;
            heart.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
}

// ========================================
// FIREWORKS ANIMATION
// ========================================
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
});

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.velocity.y += 0.1;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }
}

let fireworkParticles = [];
let fireworksActive = false;

function createFirework(x, y) {
    const colors = ['#ff6b9d', '#c06c84', '#f67280', '#f093fb', '#4facfe', '#00f2fe'];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        fireworkParticles.push(new Particle(x, y, color));
    }
}

function animateFireworks() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworkParticles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            fireworkParticles.splice(index, 1);
        } else {
            particle.update();
            particle.draw();
        }
    });

    if (fireworksActive || fireworkParticles.length > 0) {
        requestAnimationFrame(animateFireworks);
    }
}

function launchFireworks() {
    fireworksActive = true;
    let count = 0;
    const maxFireworks = 20;

    const interval = setInterval(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 0.5;
        createFirework(x, y);
        count++;

        if (count >= maxFireworks) {
            clearInterval(interval);
            fireworksActive = false;
        }
    }, 300);

    animateFireworks();
}

// ========================================
// CAROUSEL (Simple Fade)
// ========================================
const carouselContainer = document.getElementById('carouselContainer');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentSlide = 0;

function showSlide(index) {
    // Remove active class from all items
    carouselItems.forEach(item => item.classList.remove('active'));

    // Add active class to current item
    carouselItems[index].classList.add('active');
}

prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + carouselItems.length) % carouselItems.length;
    showSlide(currentSlide);
});

nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % carouselItems.length;
    showSlide(currentSlide);
});

// Auto-rotate carousel every 5 seconds
setInterval(() => {
    currentSlide = (currentSlide + 1) % carouselItems.length;
    showSlide(currentSlide);
}, 5000);

// ========================================
// LOVE METER
// ========================================
function animateLoveMeter() {
    const meterFill = document.getElementById('meterFill');
    const meterLabel = document.getElementById('meterLabel');
    let percentage = 0;
    const targetPercentage = 100;

    const interval = setInterval(() => {
        if (percentage < targetPercentage) {
            percentage += 2;
            meterFill.style.width = percentage + '%';
            meterLabel.textContent = percentage + '%';
        } else {
            clearInterval(interval);
            meterLabel.textContent = '∞% (Vô cùng!)';
        }
    }, 30);
}

// ========================================
// SPARKLE CURSOR EFFECT
// ========================================
document.addEventListener('mousemove', function (e) {
    if (Math.random() > 0.85) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = e.clientX + 'px';
        sparkle.style.top = e.clientY + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.fontSize = (Math.random() * 10 + 15) + 'px';
        sparkle.style.zIndex = '9999';
        sparkle.style.animation = 'sparkle 1s ease-out forwards';

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
});

// Add sparkle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// ========================================
// RANDOM LOVE QUOTES
// ========================================
const loveQuotes = [
    "Anh yêu em ❤️",
    "Em là cả thế giới của anh 🌍",
    "Mãi yêu em 💕",
    "Em là ánh sáng của anh ✨",
    "Yêu em nhiều lắm 💖",
    "Em là tất cả của anh 💝",
    "Anh sẽ yêu em mãi mãi 💗",
    "Em là thiên thần của anh 👼"
];

function showRandomQuote() {
    const quote = document.createElement('div');
    quote.textContent = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
    quote.style.position = 'fixed';
    quote.style.left = Math.random() * (window.innerWidth - 200) + 'px';
    quote.style.top = '-50px';
    quote.style.color = 'white';
    quote.style.fontSize = '28px';
    quote.style.fontWeight = 'bold';
    quote.style.textShadow = '0 0 20px rgba(255, 182, 193, 1), 0 0 40px rgba(255, 107, 157, 0.8)';
    quote.style.pointerEvents = 'none';
    quote.style.zIndex = '1000';
    quote.style.transition = 'all 4s ease-out';
    quote.style.opacity = '0';
    quote.style.fontFamily = "'Pacifico', cursive";

    document.body.appendChild(quote);

    setTimeout(() => {
        quote.style.top = window.innerHeight + 'px';
        quote.style.opacity = '1';
    }, 100);

    setTimeout(() => {
        quote.style.opacity = '0';
    }, 3500);

    setTimeout(() => {
        quote.remove();
    }, 4000);
}

// Show random quote every 6 seconds
setInterval(showRandomQuote, 6000);

// ========================================
// INTERACTIVE TITLE
// ========================================
const mainTitle = document.getElementById('mainTitle');
const heartIcon = document.getElementById('heartIcon');

heartIcon.addEventListener('click', function () {
    createHeartExplosion(heartIcon);
    launchFireworks();
});

mainTitle.addEventListener('mouseenter', function () {
    mainTitle.style.animation = 'none';
    setTimeout(() => {
        mainTitle.style.animation = '';
    }, 10);
});

// ========================================
// INITIALIZE
// ========================================
createFallingHearts();

// Welcome message
setTimeout(() => {
    console.log('%c💖 Happy Valentine\'s Day, Thiên Trang! 💖',
        'font-size: 24px; color: #ff6b9d; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
    console.log('%cMade with ❤️ for the most special person in the world!',
        'font-size: 16px; color: #f5576c;');
}, 1000);

// Auto-show love meter after 3 seconds
setTimeout(() => {
    animateLoveMeter();
}, 3000);

console.log('💖 Valentine Page Loaded Successfully! 💖');
