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

const emailCopyButton = document.querySelector("[data-copy-email]");
const emailCopyStatus = document.querySelector(".contact-me__copy-status");

async function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";

    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand("copy");
    textArea.remove();

    if (!copied) {
        throw new Error("Copy command failed");
    }
}

emailCopyButton?.addEventListener("click", async () => {
    const email = emailCopyButton.dataset.copyEmail;

    if (!email) return;

    try {
        await copyTextToClipboard(email);
        emailCopyButton.classList.add("is-copied");
        if (emailCopyStatus) {
            emailCopyStatus.textContent = "Email copied";
        }
    } catch {
        if (emailCopyStatus) {
            emailCopyStatus.textContent = "Could not copy email";
        }
    }

    window.setTimeout(() => {
        emailCopyButton.classList.remove("is-copied");
        if (emailCopyStatus) {
            emailCopyStatus.textContent = "";
        }
    }, 800);
});

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

document.querySelectorAll(".project-detail__carousel").forEach(carousel => {
    const track = carousel.querySelector(".project-detail__carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".project-detail__carousel-slide"));
    const previousButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    const dotsContainer = carousel.querySelector(".project-detail__carousel-dots");

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let isAnimating = false;
    let animationTimer;
    const slideTransitionDuration = 350;

    const dots = slides.map((_, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "project-detail__carousel-dot";
        dot.setAttribute("aria-label", `Go to screenshot ${index + 1}`);
        dot.addEventListener("click", event => {
            event.preventDefault();
            event.stopPropagation();
            goToSlide(index);
        });
        dotsContainer?.appendChild(dot);
        return dot;
    });

    function finishAnimation() {
        isAnimating = false;
        window.clearTimeout(animationTimer);
    }

    function updateCarousel(index, animate = true) {
        currentIndex = ((index % slides.length) + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("is-active", dotIndex === currentIndex);
            dot.setAttribute("aria-current", dotIndex === currentIndex ? "true" : "false");
        });

        if (!animate || slides.length <= 1) return;

        isAnimating = true;
        window.clearTimeout(animationTimer);
        animationTimer = window.setTimeout(finishAnimation, slideTransitionDuration);
    }

    function goToSlide(index) {
        if (isAnimating || index === currentIndex) return;

        updateCarousel(index);
    }

    track.addEventListener("transitionend", event => {
        if (event.target === track && event.propertyName === "transform") {
            finishAnimation();
        }
    });

    previousButton?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        goToSlide(currentIndex - 1);
    });

    nextButton?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        goToSlide(currentIndex + 1);
    });

    if (slides.length <= 1) {
        previousButton?.setAttribute("disabled", "");
        nextButton?.setAttribute("disabled", "");
    }

    updateCarousel(0, false);
});
