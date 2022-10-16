const themeToggleBtn = document.querySelector(".theme-toggle__wrapper");

if (localStorage.getItem("dark-theme")) {
        document.querySelector("body").classList.toggle("dark-theme");
}

themeToggleBtn.addEventListener("click", onThemeToggleBtnClick);

function onThemeToggleBtnClick() {
        localStorage.removeItem("dark-theme");

        const themeBtn = document.querySelector(".theme-toggle__thumb");
        //   themeBtn.style.backgroundColor = "teal";
        themeBtn.classList.toggle(".theme-toggle__thumb");
        themeBtn.classList.toggle("theme-toggle__thumb--after");

        document.querySelector("body").classList.toggle("dark-theme");
        if (localStorage.getItem("dark-theme")) {
                localStorage.removeItem("dark-theme");
        } else {
                localStorage.setItem("dark-theme", "true");
        }
}
