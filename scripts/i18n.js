const i18nRoot = document.body.dataset.i18nRoot || './';

const [en, pt] = await Promise.all([
    fetch(`${i18nRoot}languages/en.json`).then(r => r.json()),
    fetch(`${i18nRoot}languages/pt.json`).then(r => r.json())
]);

const translations = { en, pt };

const resumeFiles = {
    en: `${i18nRoot}assets/resume-guilherme-marques.pdf`,
    pt: `${i18nRoot}assets/cv-guilherme-marques.pdf`
};

const ptBrTimeZones = [
    'America/Sao_Paulo', 'America/Brasilia', 'America/Bahia', 'America/Belem',
    'America/Fortaleza', 'America/Maceio', 'America/Recife', 'America/Manaus',
    'America/Cuiaba', 'America/Campo_Grande', 'America/Boa_Vista', 'America/Porto_Velho',
    'America/Eirunepe', 'America/Rio_Branco', 'America/Noronha', 'America/Araguaina',
    'America/Santarem',
    'Europe/Lisbon', 'Atlantic/Madeira', 'Atlantic/Azores'
];

function setLang(lang) {
    Object.keys(translations[lang]).forEach(className => {
        document.querySelectorAll('.' + className).forEach(el => {
            const value = translations[lang][className];

            el.innerHTML = Array.isArray(value)
                ? value.join(' ')
                : value;
        });
    });

    document.querySelectorAll('[data-resume-link]').forEach(link => {
        link.href = resumeFiles[lang];
    });

    localStorage.setItem('lang', lang);
}

function detectLang() {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return ptBrTimeZones.includes(userTimeZone) ? 'pt' : 'en';
}

const savedLang = localStorage.getItem('lang');
const lang = savedLang ?? detectLang();
setLang(lang);

document.body.style.visibility = 'visible';
document.body.classList.add('page-ready');

document.querySelector('.header__nav-change-language')?.addEventListener('click', () => {
    const current = localStorage.getItem('lang');
    setLang(current === 'pt' ? 'en' : 'pt');
});
