// Loader
window.addEventListener('load', () => {
    document.getElementById('loaderWrapper').classList.add('hidden');
});

// Back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger menu with outside click close and link close
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function closeMenu() {
    navLinks.classList.remove('active');
    document.body.style.overflow = ''; // unlock scrolling
}

hamburger.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
});

// Close menu when clicking a nav link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) closeMenu();
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
        closeMenu();
    }
});

// Prevent outside click from closing menu when clicking on the toggle itself (already handled)
// Also close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) closeMenu();
});

// FAQ accordion (unchanged but works)
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});