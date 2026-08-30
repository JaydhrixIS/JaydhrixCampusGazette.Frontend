// 1. Smooth scroll + active nav highlighting
function onScroll() {
    const y = window.scrollY + 120;
    let active = null;
    const sections = [...document.querySelectorAll('main .section'), document.querySelector('.hero')];
    const navLinks = document.querySelectorAll('.nav-links > a:not(.dropdown-item)');

    sections.forEach(sec => {
        if (!sec) return;
        const top = sec.offsetTop;
        const h = sec.offsetHeight;
        if (y >= top && y < top + h) active = sec;
    });

    navLinks.forEach(a => a.classList.remove('active'));
    if (active) {
        const id = active.id || 'services';
        const link = document.querySelector('.nav-links a[href="#' + id + '"]');
        if (link) link.classList.add('active');
    }

    const toTop = document.getElementById('toTop');
    if (toTop) {
        if (window.scrollY > 600) toTop.style.display = 'block'; else toTop.style.display = 'none';
    }
}
window.addEventListener('scroll', onScroll);
onScroll();

// 2. Reveal on scroll using IntersectionObserver
const cards = document.querySelectorAll('.service-card, .feature, .faq-item, .feedback-card');
const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.transform = 'none';
            e.target.style.opacity = '1';
        } else {
            e.target.style.opacity = '0.02';
            e.target.style.transform = 'translateY(12px)';
        }
    })
}, { threshold: 0.12 });
cards.forEach(c => { c.style.opacity = '0.02'; c.style.transform = 'translateY(12px)'; io.observe(c) });

// 3. Back to top button logic
const topBtn = document.getElementById('toTop');
if (topBtn) {
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// 4. Light/Dark Mode Toggle

function applyCurrentTheme() {
    // Read from storage. If nothing is saved (new user), STRICTLY default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const cb = document.getElementById('themeCheckbox');

    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (cb) cb.checked = true;
    } else {
        document.body.classList.remove('light-mode');
        if (cb) cb.checked = false;
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    const cb = document.getElementById('themeCheckbox');
    if (cb) cb.checked = isLight;
}

// --- INITIALIZATION & BLAZOR NAVIGATION HOOKS ---

// 1. Run when the website first opens
document.addEventListener("DOMContentLoaded", applyCurrentTheme);

// 2. Run every time Blazor navigates to a new page (For .NET 8)
if (window.Blazor) {
    window.Blazor.addEventListener('enhancedload', applyCurrentTheme);
}

// 3. Universal fallback for older Blazor versions
// If a user clicks any navigation link, re-verify the theme a split-second later
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' || e.target.closest('a')) {
        setTimeout(applyCurrentTheme, 50);
    }
});

// 5. Mobile Menu Logic
function toggleMobileMenu() {
    const nav = document.getElementById('navLinks');
    const btn = document.querySelector('.mobile-toggle');
    nav.classList.toggle('open');

    if (nav.classList.contains('open')) {
        btn.innerHTML = '<span>✕</span>';
    } else {
        btn.innerHTML = '<span>☰</span>';
    }
}

function closeMobileMenu() {
    const nav = document.getElementById('navLinks');
    const btn = document.querySelector('.mobile-toggle');
    if (nav && nav.classList.contains('open')) {
        nav.classList.remove('open');
        btn.innerHTML = '<span>☰</span>';
    }
}

// 6. Mobile Dropdown Toggle (for Login & Registration submenus)
function toggleDropdown(event) {
    // Only intercept the click on mobile screens
    if (window.innerWidth <= 980) {
        event.preventDefault();
        const dropdown = event.currentTarget.closest('.dropdown');
        // Toggle the active class to show/hide the dropdown-content
        dropdown.classList.toggle('active');
    }
}

// Initialization on load
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        const cb = document.getElementById('themeCheckbox');
        if (cb) cb.checked = true;
    }
});