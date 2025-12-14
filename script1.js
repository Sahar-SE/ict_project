// Responsive mobile menu toggle with accessibility and outside-click close
(function() {
    // Twin Times mobile menu (mamoona pages)
    const btn = document.querySelector('.mobile-menu-toggle');
    const menu = document.getElementById('mainMenu');

    function toggleMobileMenu() {
        if (!menu) return;
        const isActive = menu.classList.toggle('active');
        if (btn) btn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    }

    if (btn) btn.addEventListener('click', toggleMobileMenu);
    window.toggleMobileMenu = toggleMobileMenu; // compatibility

    // Close mamoona menu on outside click / ESC
    document.addEventListener('click', function(e) {
        if (!menu || !btn) return;
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            }
        }
    });
    document.addEventListener('keydown', function(e) {
        if (!menu) return;
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            menu.classList.remove('active');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    });

    // Generic nav toggle for other pages (e.g., index.html)
    const menuBtn = document.getElementById('menu-btn') || document.querySelector('.menu-btn');
    const genericNav = document.getElementById('nav') || document.querySelector('.nav');

    function toggleNav() {
        if (!genericNav) return;
        genericNav.classList.toggle('active');
    }

    if (menuBtn) menuBtn.addEventListener('click', toggleNav);
    window.toggleNav = toggleNav; // compatibility for any remaining references
})();
