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

const courseTimeline = {
    start: new Date(2026, 2, 2, 12),
    end: new Date(2028, 10, 12, 12)
};

let statsUpdateTimer;

const ptBrTimeZones = [
    'America/Sao_Paulo', 'America/Brasilia', 'America/Bahia', 'America/Belem',
    'America/Fortaleza', 'America/Maceio', 'America/Recife', 'America/Manaus',
    'America/Cuiaba', 'America/Campo_Grande', 'America/Boa_Vista', 'America/Porto_Velho',
    'America/Eirunepe', 'America/Rio_Branco', 'America/Noronha', 'America/Araguaina',
    'America/Santarem',
    'Europe/Lisbon', 'Atlantic/Madeira', 'Atlantic/Azores'
];

function getToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
}

function addMonths(date, months) {
    const nextDate = new Date(date);
    const originalDay = nextDate.getDate();

    nextDate.setMonth(nextDate.getMonth() + months);

    if (nextDate.getDate() !== originalDay) {
        nextDate.setDate(0);
    }

    return nextDate;
}

function getDaysBetween(start, end) {
    const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

    return Math.max(0, Math.round((endUtc - startUtc) / 86400000));
}

function getCalendarDuration(start, end) {
    if (end <= start) {
        return { months: 0, days: 0, isZero: true };
    }

    let months = (end.getFullYear() - start.getFullYear()) * 12
        + end.getMonth() - start.getMonth();
    let anchorDate = addMonths(start, months);

    if (anchorDate > end) {
        months -= 1;
        anchorDate = addMonths(start, months);
    }

    return {
        months,
        days: getDaysBetween(anchorDate, end),
        isZero: false
    };
}

function getUnitLabel(lang, value, unit) {
    const labels = {
        en: {
            month: value === 1 ? 'Month' : 'Months',
            day: value === 1 ? 'Day' : 'Days'
        },
        pt: {
            month: value === 1 ? 'mês' : 'meses',
            day: value === 1 ? 'dia' : 'dias'
        }
    };

    return labels[lang][unit];
}

function formatDuration(duration, lang) {
    if (duration.isZero) {
        return '<span class="hero__info-card-duration hero__info-card-duration--zero">0</span>';
    }

    return `
        <span class="hero__info-card-duration">
            <span class="hero__info-card-duration__months">${duration.months} ${getUnitLabel(lang, duration.months, 'month')}</span>
            <span class="hero__info-card-duration__days">${duration.days} ${getUnitLabel(lang, duration.days, 'day')}</span>
        </span>
    `;
}

function formatLastUpdate(date, lang) {
    const locale = lang === 'pt' ? 'pt-BR' : 'en-US';
    const prefix = lang === 'pt' ? 'Última atualização: ' : 'Last update: ';
    const formattedDate = new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(date);

    return `${prefix}${formattedDate}`;
}

function scheduleNextStatsUpdate(lang) {
    window.clearTimeout(statsUpdateTimer);

    const now = new Date();
    const nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);

    statsUpdateTimer = window.setTimeout(() => {
        updateTimelineStats(lang);
    }, nextDay - now);
}

function updateTimelineStats(lang) {
    const today = getToday();
    const elapsed = getCalendarDuration(courseTimeline.start, today);
    const remaining = getCalendarDuration(today, courseTimeline.end);

    document.querySelectorAll('.hero__info-card-stat-elapsed-value').forEach(el => {
        el.innerHTML = formatDuration(elapsed, lang);
    });

    document.querySelectorAll('.hero__info-card-stat-remaining-value').forEach(el => {
        el.innerHTML = formatDuration(remaining, lang);
    });

    document.querySelectorAll('.hero__info-card-update').forEach(el => {
        el.textContent = formatLastUpdate(today, lang);
    });

    scheduleNextStatsUpdate(lang);
}

function setLang(lang) {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

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

    updateTimelineStats(lang);

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
