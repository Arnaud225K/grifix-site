(() => {
    const e = document.querySelectorAll(".reviews__item-video video"),
        t = document.querySelectorAll(".reviews__item-overlay button"),
        n = document.querySelectorAll(".reviews__item-video .control");
    t.forEach((o, l) => {
        const i = e[l],
            r = n[l];
        o.addEventListener("click", () =>
            (function (o, l, i) {
                var r, s, c;
                o.paused
                    ? ((c = o),
                      e.forEach((e) => {
                          e !== c && e.pause();
                      }),
                      (r = l),
                      (s = i),
                      t.forEach((e) => {
                          e !== r && (e.textContent = "Посмотреть");
                      }),
                      n.forEach((e) => {
                          e !== s && (e.style.display = "flex");
                      }),
                      o.play(),
                      (l.textContent = "Пауза"),
                      (i.style.display = "none"))
                    : (o.pause(), (l.textContent = "Посмотреть"), (i.style.display = "flex"));
            })(i, o, r)
        ),
            i.addEventListener("ended", () =>
                (function (e, t, n) {
                    (t.textContent = "Посмотреть"), (n.style.display = "flex");
                })(0, o, r)
            );
    });
})();
