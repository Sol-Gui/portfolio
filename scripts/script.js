const lowWidthMediaQuery = window.matchMedia('(max-width: 480px)');
const navToggle = document.querySelector(".header__nav-toggle");
const headerNav = document.querySelector(".header__nav");

function manageHeaderChange(e) {
    const logo = document.querySelector(".header__terminal-logo");
    
    if (!logo) return; 

    if (e.matches) {
        logo.textContent = "~/";
    } else {
        logo.textContent = "gui@developer:~$";
    }
}

manageHeaderChange(lowWidthMediaQuery);

lowWidthMediaQuery.addEventListener("change", manageHeaderChange);

if (navToggle && headerNav) {
    navToggle.addEventListener("click", () => {
        const isOpen = headerNav.classList.toggle("is-open");

        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.querySelector("i").className = isOpen
            ? "fa-solid fa-xmark"
            : "fa-solid fa-bars";
    });

    headerNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            headerNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.querySelector("i").className = "fa-solid fa-bars";
        });
    });
}
