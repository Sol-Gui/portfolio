const [en, pt] = await Promise.all([
    fetch('./languages/en.json').then(r => r.json()),
    fetch('./languages/pt.json').then(r => r.json())
]);

const translations = { en, pt };

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
            el.textContent = translations[lang][className];
        });
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

document.querySelector('.header__nav-change-language').addEventListener('click', () => {
    const current = localStorage.getItem('lang');
    setLang(current === 'pt' ? 'en' : 'pt');
});