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

window.addEventListener("pageshow", () => {
    document.body.classList.remove("page-leaving");

    if (document.body.style.visibility === "visible") {
        document.body.classList.add("page-ready");
    }
});

document.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (!link || event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;

    const destination = new URL(link.href, window.location.href);
    const samePageAnchor = destination.origin === window.location.origin
        && destination.pathname === window.location.pathname
        && destination.hash;

    if (destination.origin !== window.location.origin || samePageAnchor) return;

    event.preventDefault();
    document.body.classList.add("page-leaving");

    window.setTimeout(() => {
        window.location.href = destination.href;
    }, 50);
});
