document.addEventListener("DOMContentLoaded", function () {
    const e = window.innerHeight / 10,
        n = document.querySelector("header");
    n && (n.classList.add("header-main"), window.scrollY > e && n.classList.remove("header-main")),
        window.addEventListener("scroll", function () {
            n && (window.scrollY > e ? n.classList.remove("header-main") : n.classList.add("header-main"));
        });
});
