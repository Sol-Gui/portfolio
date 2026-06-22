const lowWidthMediaQuery = window.matchMedia('(max-width: 480px)');

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