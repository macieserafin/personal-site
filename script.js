const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('site-nav');
const navLinks = document.querySelectorAll('.nav-list a');

function closeMenu() {
    if (!menuToggle || !siteNav) {
        return;
    }

    siteNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
}

if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = siteNav.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 860) {
                closeMenu();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) {
            closeMenu();
        }
    });
}

const yearElement = document.getElementById('year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}
