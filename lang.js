let currentLang = 'sq';
let translations = {};

fetch('translations.json')
    .then(response => response.json())
    .then(data => {
        translations = data;
        applyLanguage(localStorage.getItem('lang') || 'sq');
    })
    .catch(err => console.error('Could not load translations:', err));

function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.hasAttribute('data-i18n-html')) {
                el.innerHTML = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    document.querySelectorAll('select option[data-i18n]').forEach(option => {
        const key = option.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            option.textContent = translations[lang][key];
        }
    });

    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = lang === 'sq' ? '🇬🇧 EN' : '🇦🇱 AL';
    localStorage.setItem('lang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('langToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const newLang = currentLang === 'sq' ? 'en' : 'sq';
            applyLanguage(newLang);
        });
    }
});