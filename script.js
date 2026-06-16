// =========================
// HERO CAROUSEL
// =========================

const slides = document.querySelectorAll('.slide');

let currentSlide = 0;

setInterval(() => {
    slides[currentSlide].classList.remove('active');

    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    slides[currentSlide].classList.add('active');
}, 5000);


// =========================
// ATC RADIAL MENU (FIXED + JS FAN CONTROL)
// =========================

const badge = document.querySelector('.atc-badge');
const logo = document.querySelector('.atc-logo');
const bubbles = document.querySelectorAll('.bubble');

let isOpen = false;

logo.addEventListener('click', (e) => {
    e.stopPropagation();

    isOpen = !isOpen;

    if (isOpen) {
        badge.classList.add('active');
        openFan();
    } else {
        badge.classList.remove('active');
        closeFan();
    }
});

// click outside to close
document.addEventListener('click', () => {
    if (!isOpen) return;

    isOpen = false;
    badge.classList.remove('active');
    closeFan();
});

function openFan() {
    const radius = 105;     // Distance from the badge center to the bubble centers
    const spread = 120;     // Total arc spread in degrees to wrap around the badge neatly
    const circleSize = 64;  // Uniform size for the navigation bubbles (smaller than the ATC badge)

    bubbles.forEach((bubble, i) => {
        // Centering the arc trajectory diagonally upward and leftward (135 degrees)
        const baseAngle = 135; 
        const angleOffset = (-spread / 2) + (i * (spread / (bubbles.length - 1)));
        const finalAngle = baseAngle + angleOffset;

        // Convert to radians
        const rad = finalAngle * (Math.PI / 180);

        // Standard coordinate math with inverted Y axis for the browser viewport
        const x = Math.cos(rad) * radius;
        const y = -Math.sin(rad) * radius;

        // Set uniform circular dimensions
        bubble.style.width = `${circleSize}px`;
        bubble.style.height = `${circleSize}px`;

        bubble.style.opacity = "1";
        bubble.style.pointerEvents = "auto";

        // Positions the bubbles cleanly without any text rotation, matching your layout blueprint
        bubble.style.transform = `
            translate(${x}px, ${y}px) 
            scale(1)
        `;
    });
}
function closeFan() {
    bubbles.forEach((bubble) => {
        bubble.style.opacity = "0";
        bubble.style.pointerEvents = "none";
        bubble.style.transform = "translate(0,0) scale(0.5)";
    });
}
// ==========================================
// TOGGLE ATC BADGE VISIBILITY ON SCROLL
// ==========================================

const navbar = document.getElementById('navbar');
const atcBadge = document.querySelector('.atc-badge');

// Create the observer instance
const navbarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // entry.isIntersecting is true when the navbar IS visible in the viewport
        if (!entry.isIntersecting) {
            // Navbar is out of viewport -> Show the badge
            atcBadge.classList.add('visible');
        } else {
            // Navbar is back in viewport -> Hide the badge
            atcBadge.classList.remove('visible');
            
            // Safety Check: If the menu bubbles were left open, close them
            if (typeof isOpen !== 'undefined' && isOpen) {
                isOpen = false;
                atcBadge.classList.remove('active');
                if (typeof closeFan === 'function') closeFan();
            }
        }
    });
}, {
    root: null,      // Tracks relative to the browser viewport
    threshold: 0     // Triggers the split second the navbar leaves/enters completely
});

// Start monitoring the navbar
navbarObserver.observe(navbar);