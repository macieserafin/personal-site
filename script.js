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

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    document.body.classList.add('motion-ready');

    const revealSelectors = [
        '.hero-copy',
        '.hero-card',
        '.profile-card',
        '.about-copy',
        '.timeline-item',
        '.skill-card',
        '.certificate-card',
        '.project-card',
        '.contact-card'
    ];

    const revealTargets = document.querySelectorAll(revealSelectors.join(','));

    revealTargets.forEach((element, index) => {
        element.classList.add('reveal');
        element.style.setProperty('--reveal-delay', `${Math.min((index % 6) * 55, 275)}ms`);
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.14,
            rootMargin: '0px 0px -8% 0px'
        }
    );

    revealTargets.forEach((element) => revealObserver.observe(element));
}
