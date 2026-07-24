// ============================================================
//  EFWAIZY ROOM - 3D Parallax & Interactivity
//  Edit data di sini dengan leluasa
// ============================================================

// ===== KONFIGURASI PARALLAX =====
const CONFIG = {
    // Sensitivitas gerakan (semakin tinggi semakin responsif)
    sensitivity: 0.8,

    // Kecepatan smoothing (0-1, semakin rendah semakin halus)
    smoothness: 0.08,

    // Batas maksimum rotasi (derajat)
    maxRotateX: 8,
    maxRotateY: 10,

    // Batas maksimum translate (px)
    maxTranslateX: 25,
    maxTranslateY: 18,

    // Depth tambahan untuk brand
    brandDepth: 40,
    badgeDepth: 30,
};

// ===== DATA KARTU (bisa diedit) =====
const CARD_DATA = [
    {
        grade: 4,
        emoji: '📖',
        title: 'Grade 4',
        description: 'Stories & vocabulary · fun grammar · speaking games',
        buttonText: 'explore →',
    },
    {
        grade: 5,
        emoji: '✍️',
        title: 'Grade 5',
        description: 'Writing practice · tenses · daily conversations',
        buttonText: 'explore →',
    },
    {
        grade: 6,
        emoji: '🗣️',
        title: 'Grade 6',
        description: 'Fluency · reading comprehension · project based',
        buttonText: 'explore →',
    },
];

// ===== ELEMEN DOM =====
const layer = document.getElementById('parallaxLayer');
const brand = document.getElementById('brand3d');
const badge = document.getElementById('badge3d');
const cards = document.querySelectorAll('.card-item');

// ===== STATE =====
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

// ===== UPDATE KARTU DARI DATA =====
function renderCards() {
    cards.forEach((card, index) => {
        if (index < CARD_DATA.length) {
            const data = CARD_DATA[index];
            // update konten
            const emojiSpan = card.querySelector('.emoji-big');
            const titleEl = card.querySelector('h3');
            const descEl = card.querySelector('p');
            const btnEl = card.querySelector('.btn-3d');

            if (emojiSpan) emojiSpan.textContent = data.emoji;
            if (titleEl) titleEl.textContent = data.title;
            if (descEl) descEl.textContent = data.description;
            if (btnEl) btnEl.textContent = data.buttonText;

            // update data-grade attribute
            card.dataset.grade = data.grade;
        }
    });
}

// ===== FUNGSI PARALLAX =====
function updateParallax(e) {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // normalized mouse position (-1 .. 1)
    const nx = (e.clientX / w) * 2 - 1;
    const ny = (e.clientY / h) * 2 - 1;

    mouseX = nx * CONFIG.sensitivity;
    mouseY = ny * CONFIG.sensitivity;
}

// ===== ANIMASI LOOP =====
function animate() {
    // Smooth interpolation
    targetX += (mouseX - targetX) * CONFIG.smoothness;
    targetY += (mouseY - targetY) * CONFIG.smoothness;

    // Clamp untuk keamanan
    const clampedX = Math.max(-1, Math.min(1, targetX));
    const clampedY = Math.max(-1, Math.min(1, targetY));

    // ---- PARALLAX LAYER ----
    const shiftX = clampedX * CONFIG.maxTranslateX;
    const shiftY = clampedY * CONFIG.maxTranslateY;
    const rotX = clampedY * CONFIG.maxRotateX * 0.6;
    const rotY = clampedX * CONFIG.maxRotateY * 0.6;

    layer.style.transform = `
        translateZ(0px) 
        translateX(${shiftX * 0.3}px) 
        translateY(${shiftY * 0.3}px) 
        rotateX(${rotX * 0.6}deg) 
        rotateY(${rotY * 0.6}deg)
    `;

    // ---- BRAND 3D ----
    const brandRotX = 4 + clampedY * 2.5;
    const brandRotY = 6 + clampedX * 3;
    const brandDepth = CONFIG.brandDepth + Math.abs(clampedX) * 10;
    brand.style.transform = `
        rotateX(${brandRotX}deg) 
        rotateY(${brandRotY}deg) 
        translateZ(${brandDepth}px)
    `;

    // ---- BADGE 3D ----
    const badgeRotX = -2 + clampedY * 2;
    const badgeRotY = 4 + clampedX * 3;
    const badgeDepth = CONFIG.badgeDepth + Math.abs(clampedY) * 8;
    badge.style.transform = `
        rotateX(${badgeRotX}deg) 
        rotateY(${badgeRotY}deg) 
        translateZ(${badgeDepth}px)
    `;

    // ---- CARDS 3D ----
    cards.forEach((card, i) => {
        const offset = (i + 1) * 0.7;
        const rx = clampedY * (3 + i * 0.7);
        const ry = clampedX * (4 + i * 0.5);
        const tz = 12 + (Math.abs(clampedX) + Math.abs(clampedY)) * 6;
        const scale = 1 + (Math.abs(clampedX) + Math.abs(clampedY)) * 0.008;

        card.style.transform = `
            rotateX(${2 + rx * 0.8}deg) 
            rotateY(${2 + ry * 0.8}deg) 
            translateZ(${tz}px) 
            scale(${scale})
        `;
    });

    requestAnimationFrame(animate);
}

// ===== EVENT LISTENERS =====
// Mouse
window.addEventListener('mousemove', updateParallax, { passive: true });

// Touch (mobile)
window.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateParallax({ clientX: touch.clientX, clientY: touch.clientY });
    }
}, { passive: true });

// Reset saat mouse keluar window
window.addEventListener('mouseleave', function () {
    mouseX = 0;
    mouseY = 0;
});

// ===== INISIALISASI =====
// Render kartu dari data
renderCards();

// Jalankan animasi
animate();

// ===== CONSOLE HELP =====
console.log('✨ EFWAIZY ROOM · 3D Parallax Active');
console.log('📝 Edit CARD_DATA atau CONFIG untuk mengubah konten');
console.log('📦 Data kartu:', CARD_DATA);