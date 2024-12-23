(() => {
    const e = document.querySelector(".popup__overlay.video-popup__overlay"),
        o = document.querySelector(".popup.video"),
        r = o.querySelector("iframe"),
        s = document.querySelector(".popup__close.video-popup__close"),
        c = document.querySelectorAll(".reviews__item-overlay button"),
        t = document.querySelectorAll(".reviews__item-overlay");
    function l() {
        (r.src = ""),
            e.classList.remove("show"),
            o.classList.remove("show"),
            c.forEach((e) => {
                e.style.display = "block";
            }),
            t.forEach((e) => {
                e.style.display = "flex";
            });
    }
    c.forEach((s) => {
        s.addEventListener("click", () => {
            var l;
            (l = s.closest(".reviews__item").querySelector("iframe").src),
                (r.src = l),
                e.classList.add("show"),
                o.classList.add("show"),
                c.forEach((e) => {
                    e.style.display = "none";
                }),
                t.forEach((e) => {
                    e.style.display = "none";
                });
        });
    }),
        s.addEventListener("click", l),
        e.addEventListener("click", (o) => {
            o.target === e && l();
        });
})();
