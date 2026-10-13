const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('site-nav');
const navLinks = document.querySelectorAll('.nav-list a');
const siteHeader = document.querySelector('.site-header');
const themeSwitch = document.querySelector('.theme-switch');
const themeButtons = themeSwitch.querySelectorAll('button[data-theme]');
const themeReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let chosenTheme = null;
try {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') chosenTheme = savedTheme;
} catch {
    // Theme switching also works without browser storage.
}

function setTheme(theme, userInitiated = false) {
    if (theme !== 'light' && theme !== 'dark') return;
    const previousTheme = document.documentElement.dataset.theme;
    document.documentElement.dataset.theme = theme;
    themeSwitch.dataset.theme = theme;
    themeButtons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.theme === theme));
    });
    if (userInitiated) {
        chosenTheme = theme;
        try { localStorage.setItem('portfolio-theme', theme); } catch {}
        if (previousTheme !== theme && !themeReducedMotion.matches) {
            themeSwitch.querySelector(`button[data-theme="${theme}"] svg`).animate(
                [{ transform: 'rotate(-30deg) scale(0.75)' }, { transform: 'rotate(0deg) scale(1.06)' }],
                { duration: 320, easing: 'ease-out' }
            );
        }
    }
}

themeButtons.forEach((button) => {
    button.addEventListener('click', () => setTheme(button.dataset.theme, true));
});
window.addEventListener('storage', (event) => {
    if (event.key !== 'portfolio-theme' && event.key !== null) return;
    chosenTheme = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
    setTheme(chosenTheme || 'dark');
});
setTheme(chosenTheme || 'dark');
themeSwitch.hidden = false;

// Anchor offsets follow the actual header height, including text zoom and wrapping.
function updateHeaderHeight() {
    if (siteHeader) {
        document.documentElement.style.setProperty(
            '--header-height', `${Math.ceil(siteHeader.getBoundingClientRect().height)}px`
        );
    }
}

updateHeaderHeight();
if (siteHeader && 'ResizeObserver' in window) {
    new ResizeObserver(updateHeaderHeight).observe(siteHeader);
}
window.addEventListener('resize', updateHeaderHeight);

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
            if (window.innerWidth <= 1100) {
                closeMenu();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1100) {
            closeMenu();
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteNav?.classList.contains('is-open')) {
        closeMenu();
        menuToggle.focus();
    }
});

document.addEventListener('click', (event) => {
    if (siteHeader && !siteHeader.contains(event.target)) {
        closeMenu();
    }
});

const languageSwitch = document.querySelector('.language-switch');
const languageButtons = languageSwitch.querySelectorAll('button[data-language]');
// Both translations are authored in the HTML; preserve the original English markup.
const translatedContent = [...document.querySelectorAll('[data-i18n-pl]')].map((element) => ({
    element,
    en: element.innerHTML,
    pl: element.getAttribute('data-i18n-pl'),
}));
const translatedAttributes = ['aria-label', 'alt', 'content'].flatMap((attribute) =>
    [...document.querySelectorAll(`[data-i18n-pl-${attribute}]`)].map((element) => ({
        element,
        attribute,
        en: element.getAttribute(attribute),
        pl: element.getAttribute(`data-i18n-pl-${attribute}`),
    }))
);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const languageAnimations = new Map();
const isSupportedLanguage = (language) => language === 'pl' || language === 'en';

function preferredLanguage() {
    const urlLanguage = new URL(window.location.href).searchParams.get('lang');
    if (isSupportedLanguage(urlLanguage)) return urlLanguage;
    try {
        const savedLanguage = localStorage.getItem('portfolio-language');
        if (isSupportedLanguage(savedLanguage)) return savedLanguage;
    } catch {
        // Language switching also works when browser storage is unavailable.
    }
    return navigator.language.toLowerCase().startsWith('pl') ? 'pl' : 'en';
}

function setLanguage(language, userInitiated = false) {
    if (!isSupportedLanguage(language)) return;
    const headerBottom = document.querySelector('.site-header').getBoundingClientRect().bottom;
    const readingLine = headerBottom + 64;
    const readingSection = userInitiated && window.scrollY > 0
        ? [...document.querySelectorAll('main > section')].find((section) =>
            section.getBoundingClientRect().bottom > readingLine)
        : null;
    const previousTop = readingSection?.getBoundingClientRect().top;

    document.documentElement.lang = language;
    translatedContent.forEach((translation) => {
        translation.element.innerHTML = translation[language];
    });
    translatedAttributes.forEach((translation) => {
        translation.element.setAttribute(translation.attribute, translation[language]);
    });
    languageSwitch.dataset.language = language;
    languageButtons.forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });

    if (readingSection) {
        window.scrollBy({
            top: readingSection.getBoundingClientRect().top - previousTop,
            behavior: 'instant',
        });
    }
    if (!userInitiated) return;

    try {
        localStorage.setItem('portfolio-language', language);
    } catch {
        // The current page remains translated without persisting the preference.
    }
    const url = new URL(window.location.href);
    url.searchParams.set('lang', language);
    window.history.replaceState(null, '', url);

    if (!reducedMotion.matches) {
        document.querySelectorAll('main, .site-footer').forEach((element) => {
            languageAnimations.get(element)?.cancel();
            languageAnimations.set(element, element.animate(
                [{ opacity: 0.55 }, { opacity: 1 }],
                { duration: 220, easing: 'ease-out' }
            ));
        });
    }
}

languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (document.documentElement.lang !== button.dataset.language) {
            setLanguage(button.dataset.language, true);
        }
    });
});
window.addEventListener('popstate', () => setLanguage(preferredLanguage()));
setLanguage(preferredLanguage());
languageSwitch.hidden = false;

const yearElement = document.getElementById('year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}
