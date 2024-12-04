(() => {
    "use strict";
    var e = {
            8221: () => {
                function e(e) {
                    return null !== e && "object" == typeof e && "constructor" in e && e.constructor === Object;
                }
                function t(s, i) {
                    void 0 === s && (s = {}),
                        void 0 === i && (i = {}),
                        Object.keys(i).forEach((r) => {
                            void 0 === s[r] ? (s[r] = i[r]) : e(i[r]) && e(s[r]) && Object.keys(i[r]).length > 0 && t(s[r], i[r]);
                        });
                }
                const s = {
                    body: {},
                    addEventListener() {},
                    removeEventListener() {},
                    activeElement: { blur() {}, nodeName: "" },
                    querySelector: () => null,
                    querySelectorAll: () => [],
                    getElementById: () => null,
                    createEvent: () => ({ initEvent() {} }),
                    createElement: () => ({ children: [], childNodes: [], style: {}, setAttribute() {}, getElementsByTagName: () => [] }),
                    createElementNS: () => ({}),
                    importNode: () => null,
                    location: { hash: "", host: "", hostname: "", href: "", origin: "", pathname: "", protocol: "", search: "" },
                };
                function i() {
                    const e = "undefined" != typeof document ? document : {};
                    return t(e, s), e;
                }
                const r = {
                    document: s,
                    navigator: { userAgent: "" },
                    location: { hash: "", host: "", hostname: "", href: "", origin: "", pathname: "", protocol: "", search: "" },
                    history: { replaceState() {}, pushState() {}, go() {}, back() {} },
                    CustomEvent: function () {
                        return this;
                    },
                    addEventListener() {},
                    removeEventListener() {},
                    getComputedStyle: () => ({ getPropertyValue: () => "" }),
                    Image() {},
                    Date() {},
                    screen: {},
                    setTimeout() {},
                    clearTimeout() {},
                    matchMedia: () => ({}),
                    requestAnimationFrame: (e) => ("undefined" == typeof setTimeout ? (e(), null) : setTimeout(e, 0)),
                    cancelAnimationFrame(e) {
                        "undefined" != typeof setTimeout && clearTimeout(e);
                    },
                };
                function n() {
                    const e = "undefined" != typeof window ? window : {};
                    return t(e, r), e;
                }
                function a(e, t) {
                    return void 0 === t && (t = 0), setTimeout(e, t);
                }
                function l() {
                    return Date.now();
                }
                function o(e) {
                    return "object" == typeof e && null !== e && e.constructor && "Object" === Object.prototype.toString.call(e).slice(8, -1);
                }
                function d() {
                    const e = Object(arguments.length <= 0 ? void 0 : arguments[0]),
                        t = ["__proto__", "constructor", "prototype"];
                    for (let i = 1; i < arguments.length; i += 1) {
                        const r = i < 0 || arguments.length <= i ? void 0 : arguments[i];
                        if (null != r && ((s = r), !("undefined" != typeof window && void 0 !== window.HTMLElement ? s instanceof HTMLElement : s && (1 === s.nodeType || 11 === s.nodeType)))) {
                            const s = Object.keys(Object(r)).filter((e) => t.indexOf(e) < 0);
                            for (let t = 0, i = s.length; t < i; t += 1) {
                                const i = s[t],
                                    n = Object.getOwnPropertyDescriptor(r, i);
                                void 0 !== n && n.enumerable && (o(e[i]) && o(r[i]) ? (r[i].__swiper__ ? (e[i] = r[i]) : d(e[i], r[i])) : !o(e[i]) && o(r[i]) ? ((e[i] = {}), r[i].__swiper__ ? (e[i] = r[i]) : d(e[i], r[i])) : (e[i] = r[i]));
                            }
                        }
                    }
                    var s;
                    return e;
                }
                function c(e, t, s) {
                    e.style.setProperty(t, s);
                }
                function p(e) {
                    let { swiper: t, targetPosition: s, side: i } = e;
                    const r = n(),
                        a = -t.translate;
                    let l,
                        o = null;
                    const d = t.params.speed;
                    (t.wrapperEl.style.scrollSnapType = "none"), r.cancelAnimationFrame(t.cssModeFrameID);
                    const c = s > a ? "next" : "prev",
                        p = (e, t) => ("next" === c && e >= t) || ("prev" === c && e <= t),
                        u = () => {
                            (l = new Date().getTime()), null === o && (o = l);
                            const e = Math.max(Math.min((l - o) / d, 1), 0),
                                n = 0.5 - Math.cos(e * Math.PI) / 2;
                            let c = a + n * (s - a);
                            if ((p(c, s) && (c = s), t.wrapperEl.scrollTo({ [i]: c }), p(c, s)))
                                return (
                                    (t.wrapperEl.style.overflow = "hidden"),
                                    (t.wrapperEl.style.scrollSnapType = ""),
                                    setTimeout(() => {
                                        (t.wrapperEl.style.overflow = ""), t.wrapperEl.scrollTo({ [i]: c });
                                    }),
                                    void r.cancelAnimationFrame(t.cssModeFrameID)
                                );
                            t.cssModeFrameID = r.requestAnimationFrame(u);
                        };
                    u();
                }
                function u(e, t) {
                    void 0 === t && (t = "");
                    const s = [...e.children];
                    return e instanceof HTMLSlotElement && s.push(...e.assignedElements()), t ? s.filter((e) => e.matches(t)) : s;
                }
                function m(e) {
                    try {
                        return void console.warn(e);
                    } catch (e) {}
                }
                function h(e, t) {
                    void 0 === t && (t = []);
                    const s = document.createElement(e);
                    return (
                        s.classList.add(
                            ...(Array.isArray(t)
                                ? t
                                : (function (e) {
                                      return (
                                          void 0 === e && (e = ""),
                                          e
                                              .trim()
                                              .split(" ")
                                              .filter((e) => !!e.trim())
                                      );
                                  })(t))
                        ),
                        s
                    );
                }
                function f(e, t) {
                    return n().getComputedStyle(e, null).getPropertyValue(t);
                }
                function v(e) {
                    let t,
                        s = e;
                    if (s) {
                        for (t = 0; null !== (s = s.previousSibling); ) 1 === s.nodeType && (t += 1);
                        return t;
                    }
                }
                function g(e, t) {
                    const s = [];
                    let i = e.parentElement;
                    for (; i; ) t ? i.matches(t) && s.push(i) : s.push(i), (i = i.parentElement);
                    return s;
                }
                function w(e, t, s) {
                    const i = n();
                    return s
                        ? e["width" === t ? "offsetWidth" : "offsetHeight"] +
                              parseFloat(i.getComputedStyle(e, null).getPropertyValue("width" === t ? "margin-right" : "margin-top")) +
                              parseFloat(i.getComputedStyle(e, null).getPropertyValue("width" === t ? "margin-left" : "margin-bottom"))
                        : e.offsetWidth;
                }
                function b(e) {
                    return (Array.isArray(e) ? e : [e]).filter((e) => !!e);
                }
                let S, y, T;
                function E() {
                    return (
                        S ||
                            (S = (function () {
                                const e = n(),
                                    t = i();
                                return { smoothScroll: t.documentElement && t.documentElement.style && "scrollBehavior" in t.documentElement.style, touch: !!("ontouchstart" in e || (e.DocumentTouch && t instanceof e.DocumentTouch)) };
                            })()),
                        S
                    );
                }
                function x(e) {
                    return (
                        void 0 === e && (e = {}),
                        y ||
                            (y = (function (e) {
                                let { userAgent: t } = void 0 === e ? {} : e;
                                const s = E(),
                                    i = n(),
                                    r = i.navigator.platform,
                                    a = t || i.navigator.userAgent,
                                    l = { ios: !1, android: !1 },
                                    o = i.screen.width,
                                    d = i.screen.height,
                                    c = a.match(/(Android);?[\s\/]+([\d.]+)?/);
                                let p = a.match(/(iPad).*OS\s([\d_]+)/);
                                const u = a.match(/(iPod)(.*OS\s([\d_]+))?/),
                                    m = !p && a.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
                                    h = "Win32" === r;
                                let f = "MacIntel" === r;
                                return (
                                    !p &&
                                        f &&
                                        s.touch &&
                                        ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"].indexOf(`${o}x${d}`) >= 0 &&
                                        ((p = a.match(/(Version)\/([\d.]+)/)), p || (p = [0, 1, "13_0_0"]), (f = !1)),
                                    c && !h && ((l.os = "android"), (l.android = !0)),
                                    (p || m || u) && ((l.os = "ios"), (l.ios = !0)),
                                    l
                                );
                            })(e)),
                        y
                    );
                }
                var C = {
                    on(e, t, s) {
                        const i = this;
                        if (!i.eventsListeners || i.destroyed) return i;
                        if ("function" != typeof t) return i;
                        const r = s ? "unshift" : "push";
                        return (
                            e.split(" ").forEach((e) => {
                                i.eventsListeners[e] || (i.eventsListeners[e] = []), i.eventsListeners[e][r](t);
                            }),
                            i
                        );
                    },
                    once(e, t, s) {
                        const i = this;
                        if (!i.eventsListeners || i.destroyed) return i;
                        if ("function" != typeof t) return i;
                        function r() {
                            i.off(e, r), r.__emitterProxy && delete r.__emitterProxy;
                            for (var s = arguments.length, n = new Array(s), a = 0; a < s; a++) n[a] = arguments[a];
                            t.apply(i, n);
                        }
                        return (r.__emitterProxy = t), i.on(e, r, s);
                    },
                    onAny(e, t) {
                        const s = this;
                        if (!s.eventsListeners || s.destroyed) return s;
                        if ("function" != typeof e) return s;
                        const i = t ? "unshift" : "push";
                        return s.eventsAnyListeners.indexOf(e) < 0 && s.eventsAnyListeners[i](e), s;
                    },
                    offAny(e) {
                        const t = this;
                        if (!t.eventsListeners || t.destroyed) return t;
                        if (!t.eventsAnyListeners) return t;
                        const s = t.eventsAnyListeners.indexOf(e);
                        return s >= 0 && t.eventsAnyListeners.splice(s, 1), t;
                    },
                    off(e, t) {
                        const s = this;
                        return !s.eventsListeners || s.destroyed
                            ? s
                            : s.eventsListeners
                            ? (e.split(" ").forEach((e) => {
                                  void 0 === t
                                      ? (s.eventsListeners[e] = [])
                                      : s.eventsListeners[e] &&
                                        s.eventsListeners[e].forEach((i, r) => {
                                            (i === t || (i.__emitterProxy && i.__emitterProxy === t)) && s.eventsListeners[e].splice(r, 1);
                                        });
                              }),
                              s)
                            : s;
                    },
                    emit() {
                        const e = this;
                        if (!e.eventsListeners || e.destroyed) return e;
                        if (!e.eventsListeners) return e;
                        let t, s, i;
                        for (var r = arguments.length, n = new Array(r), a = 0; a < r; a++) n[a] = arguments[a];
                        return (
                            "string" == typeof n[0] || Array.isArray(n[0]) ? ((t = n[0]), (s = n.slice(1, n.length)), (i = e)) : ((t = n[0].events), (s = n[0].data), (i = n[0].context || e)),
                            s.unshift(i),
                            (Array.isArray(t) ? t : t.split(" ")).forEach((t) => {
                                e.eventsAnyListeners &&
                                    e.eventsAnyListeners.length &&
                                    e.eventsAnyListeners.forEach((e) => {
                                        e.apply(i, [t, ...s]);
                                    }),
                                    e.eventsListeners &&
                                        e.eventsListeners[t] &&
                                        e.eventsListeners[t].forEach((e) => {
                                            e.apply(i, s);
                                        });
                            }),
                            e
                        );
                    },
                };
                const M = (e, t, s) => {
                        t && !e.classList.contains(s) ? e.classList.add(s) : !t && e.classList.contains(s) && e.classList.remove(s);
                    },
                    P = (e, t, s) => {
                        t && !e.classList.contains(s) ? e.classList.add(s) : !t && e.classList.contains(s) && e.classList.remove(s);
                    },
                    L = (e, t) => {
                        if (!e || e.destroyed || !e.params) return;
                        const s = t.closest(e.isElement ? "swiper-slide" : `.${e.params.slideClass}`);
                        if (s) {
                            let t = s.querySelector(`.${e.params.lazyPreloaderClass}`);
                            !t &&
                                e.isElement &&
                                (s.shadowRoot
                                    ? (t = s.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`))
                                    : requestAnimationFrame(() => {
                                          s.shadowRoot && ((t = s.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`)), t && t.remove());
                                      })),
                                t && t.remove();
                        }
                    },
                    k = (e, t) => {
                        if (!e.slides[t]) return;
                        const s = e.slides[t].querySelector('[loading="lazy"]');
                        s && s.removeAttribute("loading");
                    },
                    I = (e) => {
                        if (!e || e.destroyed || !e.params) return;
                        let t = e.params.lazyPreloadPrevNext;
                        const s = e.slides.length;
                        if (!s || !t || t < 0) return;
                        t = Math.min(t, s);
                        const i = "auto" === e.params.slidesPerView ? e.slidesPerViewDynamic() : Math.ceil(e.params.slidesPerView),
                            r = e.activeIndex;
                        if (e.params.grid && e.params.grid.rows > 1) {
                            const s = r,
                                n = [s - t];
                            return (
                                n.push(...Array.from({ length: t }).map((e, t) => s + i + t)),
                                void e.slides.forEach((t, s) => {
                                    n.includes(t.column) && k(e, s);
                                })
                            );
                        }
                        const n = r + i - 1;
                        if (e.params.rewind || e.params.loop)
                            for (let i = r - t; i <= n + t; i += 1) {
                                const t = ((i % s) + s) % s;
                                (t < r || t > n) && k(e, t);
                            }
                        else for (let i = Math.max(r - t, 0); i <= Math.min(n + t, s - 1); i += 1) i !== r && (i > n || i < r) && k(e, i);
                    };
                var A = {
                    updateSize: function () {
                        const e = this;
                        let t, s;
                        const i = e.el;
                        (t = void 0 !== e.params.width && null !== e.params.width ? e.params.width : i.clientWidth),
                            (s = void 0 !== e.params.height && null !== e.params.height ? e.params.height : i.clientHeight),
                            (0 === t && e.isHorizontal()) ||
                                (0 === s && e.isVertical()) ||
                                ((t = t - parseInt(f(i, "padding-left") || 0, 10) - parseInt(f(i, "padding-right") || 0, 10)),
                                (s = s - parseInt(f(i, "padding-top") || 0, 10) - parseInt(f(i, "padding-bottom") || 0, 10)),
                                Number.isNaN(t) && (t = 0),
                                Number.isNaN(s) && (s = 0),
                                Object.assign(e, { width: t, height: s, size: e.isHorizontal() ? t : s }));
                    },
                    updateSlides: function () {
                        const e = this;
                        function t(t, s) {
                            return parseFloat(t.getPropertyValue(e.getDirectionLabel(s)) || 0);
                        }
                        const s = e.params,
                            { wrapperEl: i, slidesEl: r, size: n, rtlTranslate: a, wrongRTL: l } = e,
                            o = e.virtual && s.virtual.enabled,
                            d = o ? e.virtual.slides.length : e.slides.length,
                            p = u(r, `.${e.params.slideClass}, swiper-slide`),
                            m = o ? e.virtual.slides.length : p.length;
                        let h = [];
                        const v = [],
                            g = [];
                        let b = s.slidesOffsetBefore;
                        "function" == typeof b && (b = s.slidesOffsetBefore.call(e));
                        let S = s.slidesOffsetAfter;
                        "function" == typeof S && (S = s.slidesOffsetAfter.call(e));
                        const y = e.snapGrid.length,
                            T = e.slidesGrid.length;
                        let E = s.spaceBetween,
                            x = -b,
                            C = 0,
                            M = 0;
                        if (void 0 === n) return;
                        "string" == typeof E && E.indexOf("%") >= 0 ? (E = (parseFloat(E.replace("%", "")) / 100) * n) : "string" == typeof E && (E = parseFloat(E)),
                            (e.virtualSize = -E),
                            p.forEach((e) => {
                                a ? (e.style.marginLeft = "") : (e.style.marginRight = ""), (e.style.marginBottom = ""), (e.style.marginTop = "");
                            }),
                            s.centeredSlides && s.cssMode && (c(i, "--swiper-centered-offset-before", ""), c(i, "--swiper-centered-offset-after", ""));
                        const P = s.grid && s.grid.rows > 1 && e.grid;
                        let L;
                        P ? e.grid.initSlides(p) : e.grid && e.grid.unsetSlides();
                        const k = "auto" === s.slidesPerView && s.breakpoints && Object.keys(s.breakpoints).filter((e) => void 0 !== s.breakpoints[e].slidesPerView).length > 0;
                        for (let i = 0; i < m; i += 1) {
                            let r;
                            if (((L = 0), p[i] && (r = p[i]), P && e.grid.updateSlide(i, r, p), !p[i] || "none" !== f(r, "display"))) {
                                if ("auto" === s.slidesPerView) {
                                    k && (p[i].style[e.getDirectionLabel("width")] = "");
                                    const n = getComputedStyle(r),
                                        a = r.style.transform,
                                        l = r.style.webkitTransform;
                                    if ((a && (r.style.transform = "none"), l && (r.style.webkitTransform = "none"), s.roundLengths)) L = e.isHorizontal() ? w(r, "width", !0) : w(r, "height", !0);
                                    else {
                                        const e = t(n, "width"),
                                            s = t(n, "padding-left"),
                                            i = t(n, "padding-right"),
                                            a = t(n, "margin-left"),
                                            l = t(n, "margin-right"),
                                            o = n.getPropertyValue("box-sizing");
                                        if (o && "border-box" === o) L = e + a + l;
                                        else {
                                            const { clientWidth: t, offsetWidth: n } = r;
                                            L = e + s + i + a + l + (n - t);
                                        }
                                    }
                                    a && (r.style.transform = a), l && (r.style.webkitTransform = l), s.roundLengths && (L = Math.floor(L));
                                } else (L = (n - (s.slidesPerView - 1) * E) / s.slidesPerView), s.roundLengths && (L = Math.floor(L)), p[i] && (p[i].style[e.getDirectionLabel("width")] = `${L}px`);
                                p[i] && (p[i].swiperSlideSize = L),
                                    g.push(L),
                                    s.centeredSlides
                                        ? ((x = x + L / 2 + C / 2 + E),
                                          0 === C && 0 !== i && (x = x - n / 2 - E),
                                          0 === i && (x = x - n / 2 - E),
                                          Math.abs(x) < 0.001 && (x = 0),
                                          s.roundLengths && (x = Math.floor(x)),
                                          M % s.slidesPerGroup == 0 && h.push(x),
                                          v.push(x))
                                        : (s.roundLengths && (x = Math.floor(x)), (M - Math.min(e.params.slidesPerGroupSkip, M)) % e.params.slidesPerGroup == 0 && h.push(x), v.push(x), (x = x + L + E)),
                                    (e.virtualSize += L + E),
                                    (C = L),
                                    (M += 1);
                            }
                        }
                        if (
                            ((e.virtualSize = Math.max(e.virtualSize, n) + S),
                            a && l && ("slide" === s.effect || "coverflow" === s.effect) && (i.style.width = `${e.virtualSize + E}px`),
                            s.setWrapperSize && (i.style[e.getDirectionLabel("width")] = `${e.virtualSize + E}px`),
                            P && e.grid.updateWrapperSize(L, h),
                            !s.centeredSlides)
                        ) {
                            const t = [];
                            for (let i = 0; i < h.length; i += 1) {
                                let r = h[i];
                                s.roundLengths && (r = Math.floor(r)), h[i] <= e.virtualSize - n && t.push(r);
                            }
                            (h = t), Math.floor(e.virtualSize - n) - Math.floor(h[h.length - 1]) > 1 && h.push(e.virtualSize - n);
                        }
                        if (o && s.loop) {
                            const t = g[0] + E;
                            if (s.slidesPerGroup > 1) {
                                const i = Math.ceil((e.virtual.slidesBefore + e.virtual.slidesAfter) / s.slidesPerGroup),
                                    r = t * s.slidesPerGroup;
                                for (let e = 0; e < i; e += 1) h.push(h[h.length - 1] + r);
                            }
                            for (let i = 0; i < e.virtual.slidesBefore + e.virtual.slidesAfter; i += 1) 1 === s.slidesPerGroup && h.push(h[h.length - 1] + t), v.push(v[v.length - 1] + t), (e.virtualSize += t);
                        }
                        if ((0 === h.length && (h = [0]), 0 !== E)) {
                            const t = e.isHorizontal() && a ? "marginLeft" : e.getDirectionLabel("marginRight");
                            p.filter((e, t) => !(s.cssMode && !s.loop) || t !== p.length - 1).forEach((e) => {
                                e.style[t] = `${E}px`;
                            });
                        }
                        if (s.centeredSlides && s.centeredSlidesBounds) {
                            let e = 0;
                            g.forEach((t) => {
                                e += t + (E || 0);
                            }),
                                (e -= E);
                            const t = e > n ? e - n : 0;
                            h = h.map((e) => (e <= 0 ? -b : e > t ? t + S : e));
                        }
                        if (s.centerInsufficientSlides) {
                            let e = 0;
                            g.forEach((t) => {
                                e += t + (E || 0);
                            }),
                                (e -= E);
                            const t = (s.slidesOffsetBefore || 0) + (s.slidesOffsetAfter || 0);
                            if (e + t < n) {
                                const s = (n - e - t) / 2;
                                h.forEach((e, t) => {
                                    h[t] = e - s;
                                }),
                                    v.forEach((e, t) => {
                                        v[t] = e + s;
                                    });
                            }
                        }
                        if ((Object.assign(e, { slides: p, snapGrid: h, slidesGrid: v, slidesSizesGrid: g }), s.centeredSlides && s.cssMode && !s.centeredSlidesBounds)) {
                            c(i, "--swiper-centered-offset-before", -h[0] + "px"), c(i, "--swiper-centered-offset-after", e.size / 2 - g[g.length - 1] / 2 + "px");
                            const t = -e.snapGrid[0],
                                s = -e.slidesGrid[0];
                            (e.snapGrid = e.snapGrid.map((e) => e + t)), (e.slidesGrid = e.slidesGrid.map((e) => e + s));
                        }
                        if (
                            (m !== d && e.emit("slidesLengthChange"),
                            h.length !== y && (e.params.watchOverflow && e.checkOverflow(), e.emit("snapGridLengthChange")),
                            v.length !== T && e.emit("slidesGridLengthChange"),
                            s.watchSlidesProgress && e.updateSlidesOffset(),
                            e.emit("slidesUpdated"),
                            !(o || s.cssMode || ("slide" !== s.effect && "fade" !== s.effect)))
                        ) {
                            const t = `${s.containerModifierClass}backface-hidden`,
                                i = e.el.classList.contains(t);
                            m <= s.maxBackfaceHiddenSlides ? i || e.el.classList.add(t) : i && e.el.classList.remove(t);
                        }
                    },
                    updateAutoHeight: function (e) {
                        const t = this,
                            s = [],
                            i = t.virtual && t.params.virtual.enabled;
                        let r,
                            n = 0;
                        "number" == typeof e ? t.setTransition(e) : !0 === e && t.setTransition(t.params.speed);
                        const a = (e) => (i ? t.slides[t.getSlideIndexByData(e)] : t.slides[e]);
                        if ("auto" !== t.params.slidesPerView && t.params.slidesPerView > 1)
                            if (t.params.centeredSlides)
                                (t.visibleSlides || []).forEach((e) => {
                                    s.push(e);
                                });
                            else
                                for (r = 0; r < Math.ceil(t.params.slidesPerView); r += 1) {
                                    const e = t.activeIndex + r;
                                    if (e > t.slides.length && !i) break;
                                    s.push(a(e));
                                }
                        else s.push(a(t.activeIndex));
                        for (r = 0; r < s.length; r += 1)
                            if (void 0 !== s[r]) {
                                const e = s[r].offsetHeight;
                                n = e > n ? e : n;
                            }
                        (n || 0 === n) && (t.wrapperEl.style.height = `${n}px`);
                    },
                    updateSlidesOffset: function () {
                        const e = this,
                            t = e.slides,
                            s = e.isElement ? (e.isHorizontal() ? e.wrapperEl.offsetLeft : e.wrapperEl.offsetTop) : 0;
                        for (let i = 0; i < t.length; i += 1) t[i].swiperSlideOffset = (e.isHorizontal() ? t[i].offsetLeft : t[i].offsetTop) - s - e.cssOverflowAdjustment();
                    },
                    updateSlidesProgress: function (e) {
                        void 0 === e && (e = (this && this.translate) || 0);
                        const t = this,
                            s = t.params,
                            { slides: i, rtlTranslate: r, snapGrid: n } = t;
                        if (0 === i.length) return;
                        void 0 === i[0].swiperSlideOffset && t.updateSlidesOffset();
                        let a = -e;
                        r && (a = e), (t.visibleSlidesIndexes = []), (t.visibleSlides = []);
                        let l = s.spaceBetween;
                        "string" == typeof l && l.indexOf("%") >= 0 ? (l = (parseFloat(l.replace("%", "")) / 100) * t.size) : "string" == typeof l && (l = parseFloat(l));
                        for (let e = 0; e < i.length; e += 1) {
                            const o = i[e];
                            let d = o.swiperSlideOffset;
                            s.cssMode && s.centeredSlides && (d -= i[0].swiperSlideOffset);
                            const c = (a + (s.centeredSlides ? t.minTranslate() : 0) - d) / (o.swiperSlideSize + l),
                                p = (a - n[0] + (s.centeredSlides ? t.minTranslate() : 0) - d) / (o.swiperSlideSize + l),
                                u = -(a - d),
                                m = u + t.slidesSizesGrid[e],
                                h = u >= 0 && u <= t.size - t.slidesSizesGrid[e],
                                f = (u >= 0 && u < t.size - 1) || (m > 1 && m <= t.size) || (u <= 0 && m >= t.size);
                            f && (t.visibleSlides.push(o), t.visibleSlidesIndexes.push(e)), M(o, f, s.slideVisibleClass), M(o, h, s.slideFullyVisibleClass), (o.progress = r ? -c : c), (o.originalProgress = r ? -p : p);
                        }
                    },
                    updateProgress: function (e) {
                        const t = this;
                        if (void 0 === e) {
                            const s = t.rtlTranslate ? -1 : 1;
                            e = (t && t.translate && t.translate * s) || 0;
                        }
                        const s = t.params,
                            i = t.maxTranslate() - t.minTranslate();
                        let { progress: r, isBeginning: n, isEnd: a, progressLoop: l } = t;
                        const o = n,
                            d = a;
                        if (0 === i) (r = 0), (n = !0), (a = !0);
                        else {
                            r = (e - t.minTranslate()) / i;
                            const s = Math.abs(e - t.minTranslate()) < 1,
                                l = Math.abs(e - t.maxTranslate()) < 1;
                            (n = s || r <= 0), (a = l || r >= 1), s && (r = 0), l && (r = 1);
                        }
                        if (s.loop) {
                            const s = t.getSlideIndexByData(0),
                                i = t.getSlideIndexByData(t.slides.length - 1),
                                r = t.slidesGrid[s],
                                n = t.slidesGrid[i],
                                a = t.slidesGrid[t.slidesGrid.length - 1],
                                o = Math.abs(e);
                            (l = o >= r ? (o - r) / a : (o + a - n) / a), l > 1 && (l -= 1);
                        }
                        Object.assign(t, { progress: r, progressLoop: l, isBeginning: n, isEnd: a }),
                            (s.watchSlidesProgress || (s.centeredSlides && s.autoHeight)) && t.updateSlidesProgress(e),
                            n && !o && t.emit("reachBeginning toEdge"),
                            a && !d && t.emit("reachEnd toEdge"),
                            ((o && !n) || (d && !a)) && t.emit("fromEdge"),
                            t.emit("progress", r);
                    },
                    updateSlidesClasses: function () {
                        const e = this,
                            { slides: t, params: s, slidesEl: i, activeIndex: r } = e,
                            n = e.virtual && s.virtual.enabled,
                            a = e.grid && s.grid && s.grid.rows > 1,
                            l = (e) => u(i, `.${s.slideClass}${e}, swiper-slide${e}`)[0];
                        let o, d, c;
                        if (n)
                            if (s.loop) {
                                let t = r - e.virtual.slidesBefore;
                                t < 0 && (t = e.virtual.slides.length + t), t >= e.virtual.slides.length && (t -= e.virtual.slides.length), (o = l(`[data-swiper-slide-index="${t}"]`));
                            } else o = l(`[data-swiper-slide-index="${r}"]`);
                        else a ? ((o = t.filter((e) => e.column === r)[0]), (c = t.filter((e) => e.column === r + 1)[0]), (d = t.filter((e) => e.column === r - 1)[0])) : (o = t[r]);
                        o &&
                            (a ||
                                ((c = (function (e, t) {
                                    const s = [];
                                    for (; e.nextElementSibling; ) {
                                        const i = e.nextElementSibling;
                                        t ? i.matches(t) && s.push(i) : s.push(i), (e = i);
                                    }
                                    return s;
                                })(o, `.${s.slideClass}, swiper-slide`)[0]),
                                s.loop && !c && (c = t[0]),
                                (d = (function (e, t) {
                                    const s = [];
                                    for (; e.previousElementSibling; ) {
                                        const i = e.previousElementSibling;
                                        t ? i.matches(t) && s.push(i) : s.push(i), (e = i);
                                    }
                                    return s;
                                })(o, `.${s.slideClass}, swiper-slide`)[0]),
                                s.loop && 0 === !d && (d = t[t.length - 1]))),
                            t.forEach((e) => {
                                P(e, e === o, s.slideActiveClass), P(e, e === c, s.slideNextClass), P(e, e === d, s.slidePrevClass);
                            }),
                            e.emitSlidesClasses();
                    },
                    updateActiveIndex: function (e) {
                        const t = this,
                            s = t.rtlTranslate ? t.translate : -t.translate,
                            { snapGrid: i, params: r, activeIndex: n, realIndex: a, snapIndex: l } = t;
                        let o,
                            d = e;
                        const c = (e) => {
                            let s = e - t.virtual.slidesBefore;
                            return s < 0 && (s = t.virtual.slides.length + s), s >= t.virtual.slides.length && (s -= t.virtual.slides.length), s;
                        };
                        if (
                            (void 0 === d &&
                                (d = (function (e) {
                                    const { slidesGrid: t, params: s } = e,
                                        i = e.rtlTranslate ? e.translate : -e.translate;
                                    let r;
                                    for (let e = 0; e < t.length; e += 1) void 0 !== t[e + 1] ? (i >= t[e] && i < t[e + 1] - (t[e + 1] - t[e]) / 2 ? (r = e) : i >= t[e] && i < t[e + 1] && (r = e + 1)) : i >= t[e] && (r = e);
                                    return s.normalizeSlideIndex && (r < 0 || void 0 === r) && (r = 0), r;
                                })(t)),
                            i.indexOf(s) >= 0)
                        )
                            o = i.indexOf(s);
                        else {
                            const e = Math.min(r.slidesPerGroupSkip, d);
                            o = e + Math.floor((d - e) / r.slidesPerGroup);
                        }
                        if ((o >= i.length && (o = i.length - 1), d === n && !t.params.loop)) return void (o !== l && ((t.snapIndex = o), t.emit("snapIndexChange")));
                        if (d === n && t.params.loop && t.virtual && t.params.virtual.enabled) return void (t.realIndex = c(d));
                        const p = t.grid && r.grid && r.grid.rows > 1;
                        let u;
                        if (t.virtual && r.virtual.enabled && r.loop) u = c(d);
                        else if (p) {
                            const e = t.slides.filter((e) => e.column === d)[0];
                            let s = parseInt(e.getAttribute("data-swiper-slide-index"), 10);
                            Number.isNaN(s) && (s = Math.max(t.slides.indexOf(e), 0)), (u = Math.floor(s / r.grid.rows));
                        } else if (t.slides[d]) {
                            const e = t.slides[d].getAttribute("data-swiper-slide-index");
                            u = e ? parseInt(e, 10) : d;
                        } else u = d;
                        Object.assign(t, { previousSnapIndex: l, snapIndex: o, previousRealIndex: a, realIndex: u, previousIndex: n, activeIndex: d }),
                            t.initialized && I(t),
                            t.emit("activeIndexChange"),
                            t.emit("snapIndexChange"),
                            (t.initialized || t.params.runCallbacksOnInit) && (a !== u && t.emit("realIndexChange"), t.emit("slideChange"));
                    },
                    updateClickedSlide: function (e, t) {
                        const s = this,
                            i = s.params;
                        let r = e.closest(`.${i.slideClass}, swiper-slide`);
                        !r &&
                            s.isElement &&
                            t &&
                            t.length > 1 &&
                            t.includes(e) &&
                            [...t.slice(t.indexOf(e) + 1, t.length)].forEach((e) => {
                                !r && e.matches && e.matches(`.${i.slideClass}, swiper-slide`) && (r = e);
                            });
                        let n,
                            a = !1;
                        if (r)
                            for (let e = 0; e < s.slides.length; e += 1)
                                if (s.slides[e] === r) {
                                    (a = !0), (n = e);
                                    break;
                                }
                        if (!r || !a) return (s.clickedSlide = void 0), void (s.clickedIndex = void 0);
                        (s.clickedSlide = r),
                            s.virtual && s.params.virtual.enabled ? (s.clickedIndex = parseInt(r.getAttribute("data-swiper-slide-index"), 10)) : (s.clickedIndex = n),
                            i.slideToClickedSlide && void 0 !== s.clickedIndex && s.clickedIndex !== s.activeIndex && s.slideToClickedSlide();
                    },
                };
                function O(e) {
                    let { swiper: t, runCallbacks: s, direction: i, step: r } = e;
                    const { activeIndex: n, previousIndex: a } = t;
                    let l = i;
                    if ((l || (l = n > a ? "next" : n < a ? "prev" : "reset"), t.emit(`transition${r}`), s && n !== a)) {
                        if ("reset" === l) return void t.emit(`slideResetTransition${r}`);
                        t.emit(`slideChangeTransition${r}`), "next" === l ? t.emit(`slideNextTransition${r}`) : t.emit(`slidePrevTransition${r}`);
                    }
                }
                var z = {
                        slideTo: function (e, t, s, i, r) {
                            void 0 === e && (e = 0), void 0 === s && (s = !0), "string" == typeof e && (e = parseInt(e, 10));
                            const n = this;
                            let a = e;
                            a < 0 && (a = 0);
                            const { params: l, snapGrid: o, slidesGrid: d, previousIndex: c, activeIndex: u, rtlTranslate: m, wrapperEl: h, enabled: f } = n;
                            if ((!f && !i && !r) || n.destroyed || (n.animating && l.preventInteractionOnTransition)) return !1;
                            void 0 === t && (t = n.params.speed);
                            const v = Math.min(n.params.slidesPerGroupSkip, a);
                            let g = v + Math.floor((a - v) / n.params.slidesPerGroup);
                            g >= o.length && (g = o.length - 1);
                            const w = -o[g];
                            if (l.normalizeSlideIndex)
                                for (let e = 0; e < d.length; e += 1) {
                                    const t = -Math.floor(100 * w),
                                        s = Math.floor(100 * d[e]),
                                        i = Math.floor(100 * d[e + 1]);
                                    void 0 !== d[e + 1] ? (t >= s && t < i - (i - s) / 2 ? (a = e) : t >= s && t < i && (a = e + 1)) : t >= s && (a = e);
                                }
                            if (n.initialized && a !== u) {
                                if (!n.allowSlideNext && (m ? w > n.translate && w > n.minTranslate() : w < n.translate && w < n.minTranslate())) return !1;
                                if (!n.allowSlidePrev && w > n.translate && w > n.maxTranslate() && (u || 0) !== a) return !1;
                            }
                            let b;
                            a !== (c || 0) && s && n.emit("beforeSlideChangeStart"), n.updateProgress(w), (b = a > u ? "next" : a < u ? "prev" : "reset");
                            const S = n.virtual && n.params.virtual.enabled;
                            if ((!S || !r) && ((m && -w === n.translate) || (!m && w === n.translate)))
                                return n.updateActiveIndex(a), l.autoHeight && n.updateAutoHeight(), n.updateSlidesClasses(), "slide" !== l.effect && n.setTranslate(w), "reset" !== b && (n.transitionStart(s, b), n.transitionEnd(s, b)), !1;
                            if (l.cssMode) {
                                const e = n.isHorizontal(),
                                    s = m ? w : -w;
                                if (0 === t)
                                    S && ((n.wrapperEl.style.scrollSnapType = "none"), (n._immediateVirtual = !0)),
                                        S && !n._cssModeVirtualInitialSet && n.params.initialSlide > 0
                                            ? ((n._cssModeVirtualInitialSet = !0),
                                              requestAnimationFrame(() => {
                                                  h[e ? "scrollLeft" : "scrollTop"] = s;
                                              }))
                                            : (h[e ? "scrollLeft" : "scrollTop"] = s),
                                        S &&
                                            requestAnimationFrame(() => {
                                                (n.wrapperEl.style.scrollSnapType = ""), (n._immediateVirtual = !1);
                                            });
                                else {
                                    if (!n.support.smoothScroll) return p({ swiper: n, targetPosition: s, side: e ? "left" : "top" }), !0;
                                    h.scrollTo({ [e ? "left" : "top"]: s, behavior: "smooth" });
                                }
                                return !0;
                            }
                            return (
                                n.setTransition(t),
                                n.setTranslate(w),
                                n.updateActiveIndex(a),
                                n.updateSlidesClasses(),
                                n.emit("beforeTransitionStart", t, i),
                                n.transitionStart(s, b),
                                0 === t
                                    ? n.transitionEnd(s, b)
                                    : n.animating ||
                                      ((n.animating = !0),
                                      n.onSlideToWrapperTransitionEnd ||
                                          (n.onSlideToWrapperTransitionEnd = function (e) {
                                              n &&
                                                  !n.destroyed &&
                                                  e.target === this &&
                                                  (n.wrapperEl.removeEventListener("transitionend", n.onSlideToWrapperTransitionEnd), (n.onSlideToWrapperTransitionEnd = null), delete n.onSlideToWrapperTransitionEnd, n.transitionEnd(s, b));
                                          }),
                                      n.wrapperEl.addEventListener("transitionend", n.onSlideToWrapperTransitionEnd)),
                                !0
                            );
                        },
                        slideToLoop: function (e, t, s, i) {
                            void 0 === e && (e = 0), void 0 === s && (s = !0), "string" == typeof e && (e = parseInt(e, 10));
                            const r = this;
                            if (r.destroyed) return;
                            void 0 === t && (t = r.params.speed);
                            const n = r.grid && r.params.grid && r.params.grid.rows > 1;
                            let a = e;
                            if (r.params.loop)
                                if (r.virtual && r.params.virtual.enabled) a += r.virtual.slidesBefore;
                                else {
                                    let e;
                                    if (n) {
                                        const t = a * r.params.grid.rows;
                                        e = r.slides.filter((e) => 1 * e.getAttribute("data-swiper-slide-index") === t)[0].column;
                                    } else e = r.getSlideIndexByData(a);
                                    const t = n ? Math.ceil(r.slides.length / r.params.grid.rows) : r.slides.length,
                                        { centeredSlides: s } = r.params;
                                    let l = r.params.slidesPerView;
                                    "auto" === l ? (l = r.slidesPerViewDynamic()) : ((l = Math.ceil(parseFloat(r.params.slidesPerView, 10))), s && l % 2 == 0 && (l += 1));
                                    let o = t - e < l;
                                    if ((s && (o = o || e < Math.ceil(l / 2)), i && s && "auto" !== r.params.slidesPerView && !n && (o = !1), o)) {
                                        const i = s ? (e < r.activeIndex ? "prev" : "next") : e - r.activeIndex - 1 < r.params.slidesPerView ? "next" : "prev";
                                        r.loopFix({ direction: i, slideTo: !0, activeSlideIndex: "next" === i ? e + 1 : e - t + 1, slideRealIndex: "next" === i ? r.realIndex : void 0 });
                                    }
                                    if (n) {
                                        const e = a * r.params.grid.rows;
                                        a = r.slides.filter((t) => 1 * t.getAttribute("data-swiper-slide-index") === e)[0].column;
                                    } else a = r.getSlideIndexByData(a);
                                }
                            return (
                                requestAnimationFrame(() => {
                                    r.slideTo(a, t, s, i);
                                }),
                                r
                            );
                        },
                        slideNext: function (e, t, s) {
                            void 0 === t && (t = !0);
                            const i = this,
                                { enabled: r, params: n, animating: a } = i;
                            if (!r || i.destroyed) return i;
                            void 0 === e && (e = i.params.speed);
                            let l = n.slidesPerGroup;
                            "auto" === n.slidesPerView && 1 === n.slidesPerGroup && n.slidesPerGroupAuto && (l = Math.max(i.slidesPerViewDynamic("current", !0), 1));
                            const o = i.activeIndex < n.slidesPerGroupSkip ? 1 : l,
                                d = i.virtual && n.virtual.enabled;
                            if (n.loop) {
                                if (a && !d && n.loopPreventsSliding) return !1;
                                if ((i.loopFix({ direction: "next" }), (i._clientLeft = i.wrapperEl.clientLeft), i.activeIndex === i.slides.length - 1 && n.cssMode))
                                    return (
                                        requestAnimationFrame(() => {
                                            i.slideTo(i.activeIndex + o, e, t, s);
                                        }),
                                        !0
                                    );
                            }
                            return n.rewind && i.isEnd ? i.slideTo(0, e, t, s) : i.slideTo(i.activeIndex + o, e, t, s);
                        },
                        slidePrev: function (e, t, s) {
                            void 0 === t && (t = !0);
                            const i = this,
                                { params: r, snapGrid: n, slidesGrid: a, rtlTranslate: l, enabled: o, animating: d } = i;
                            if (!o || i.destroyed) return i;
                            void 0 === e && (e = i.params.speed);
                            const c = i.virtual && r.virtual.enabled;
                            if (r.loop) {
                                if (d && !c && r.loopPreventsSliding) return !1;
                                i.loopFix({ direction: "prev" }), (i._clientLeft = i.wrapperEl.clientLeft);
                            }
                            function p(e) {
                                return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e);
                            }
                            const u = p(l ? i.translate : -i.translate),
                                m = n.map((e) => p(e));
                            let h = n[m.indexOf(u) - 1];
                            if (void 0 === h && r.cssMode) {
                                let e;
                                n.forEach((t, s) => {
                                    u >= t && (e = s);
                                }),
                                    void 0 !== e && (h = n[e > 0 ? e - 1 : e]);
                            }
                            let f = 0;
                            if (
                                (void 0 !== h &&
                                    ((f = a.indexOf(h)),
                                    f < 0 && (f = i.activeIndex - 1),
                                    "auto" === r.slidesPerView && 1 === r.slidesPerGroup && r.slidesPerGroupAuto && ((f = f - i.slidesPerViewDynamic("previous", !0) + 1), (f = Math.max(f, 0)))),
                                r.rewind && i.isBeginning)
                            ) {
                                const r = i.params.virtual && i.params.virtual.enabled && i.virtual ? i.virtual.slides.length - 1 : i.slides.length - 1;
                                return i.slideTo(r, e, t, s);
                            }
                            return r.loop && 0 === i.activeIndex && r.cssMode
                                ? (requestAnimationFrame(() => {
                                      i.slideTo(f, e, t, s);
                                  }),
                                  !0)
                                : i.slideTo(f, e, t, s);
                        },
                        slideReset: function (e, t, s) {
                            void 0 === t && (t = !0);
                            const i = this;
                            if (!i.destroyed) return void 0 === e && (e = i.params.speed), i.slideTo(i.activeIndex, e, t, s);
                        },
                        slideToClosest: function (e, t, s, i) {
                            void 0 === t && (t = !0), void 0 === i && (i = 0.5);
                            const r = this;
                            if (r.destroyed) return;
                            void 0 === e && (e = r.params.speed);
                            let n = r.activeIndex;
                            const a = Math.min(r.params.slidesPerGroupSkip, n),
                                l = a + Math.floor((n - a) / r.params.slidesPerGroup),
                                o = r.rtlTranslate ? r.translate : -r.translate;
                            if (o >= r.snapGrid[l]) {
                                const e = r.snapGrid[l];
                                o - e > (r.snapGrid[l + 1] - e) * i && (n += r.params.slidesPerGroup);
                            } else {
                                const e = r.snapGrid[l - 1];
                                o - e <= (r.snapGrid[l] - e) * i && (n -= r.params.slidesPerGroup);
                            }
                            return (n = Math.max(n, 0)), (n = Math.min(n, r.slidesGrid.length - 1)), r.slideTo(n, e, t, s);
                        },
                        slideToClickedSlide: function () {
                            const e = this;
                            if (e.destroyed) return;
                            const { params: t, slidesEl: s } = e,
                                i = "auto" === t.slidesPerView ? e.slidesPerViewDynamic() : t.slidesPerView;
                            let r,
                                n = e.clickedIndex;
                            const l = e.isElement ? "swiper-slide" : `.${t.slideClass}`;
                            if (t.loop) {
                                if (e.animating) return;
                                (r = parseInt(e.clickedSlide.getAttribute("data-swiper-slide-index"), 10)),
                                    t.centeredSlides
                                        ? n < e.loopedSlides - i / 2 || n > e.slides.length - e.loopedSlides + i / 2
                                            ? (e.loopFix(),
                                              (n = e.getSlideIndex(u(s, `${l}[data-swiper-slide-index="${r}"]`)[0])),
                                              a(() => {
                                                  e.slideTo(n);
                                              }))
                                            : e.slideTo(n)
                                        : n > e.slides.length - i
                                        ? (e.loopFix(),
                                          (n = e.getSlideIndex(u(s, `${l}[data-swiper-slide-index="${r}"]`)[0])),
                                          a(() => {
                                              e.slideTo(n);
                                          }))
                                        : e.slideTo(n);
                            } else e.slideTo(n);
                        },
                    },
                    G = {
                        loopCreate: function (e) {
                            const t = this,
                                { params: s, slidesEl: i } = t;
                            if (!s.loop || (t.virtual && t.params.virtual.enabled)) return;
                            const r = () => {
                                    u(i, `.${s.slideClass}, swiper-slide`).forEach((e, t) => {
                                        e.setAttribute("data-swiper-slide-index", t);
                                    });
                                },
                                n = t.grid && s.grid && s.grid.rows > 1,
                                a = s.slidesPerGroup * (n ? s.grid.rows : 1),
                                l = t.slides.length % a != 0,
                                o = n && t.slides.length % s.grid.rows != 0,
                                d = (e) => {
                                    for (let i = 0; i < e; i += 1) {
                                        const e = t.isElement ? h("swiper-slide", [s.slideBlankClass]) : h("div", [s.slideClass, s.slideBlankClass]);
                                        t.slidesEl.append(e);
                                    }
                                };
                            l
                                ? (s.loopAddBlankSlides
                                      ? (d(a - (t.slides.length % a)), t.recalcSlides(), t.updateSlides())
                                      : m("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)"),
                                  r())
                                : o
                                ? (s.loopAddBlankSlides
                                      ? (d(s.grid.rows - (t.slides.length % s.grid.rows)), t.recalcSlides(), t.updateSlides())
                                      : m("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)"),
                                  r())
                                : r(),
                                t.loopFix({ slideRealIndex: e, direction: s.centeredSlides ? void 0 : "next" });
                        },
                        loopFix: function (e) {
                            let { slideRealIndex: t, slideTo: s = !0, direction: i, setTranslate: r, activeSlideIndex: n, byController: a, byMousewheel: l } = void 0 === e ? {} : e;
                            const o = this;
                            if (!o.params.loop) return;
                            o.emit("beforeLoopFix");
                            const { slides: d, allowSlidePrev: c, allowSlideNext: p, slidesEl: u, params: h } = o,
                                { centeredSlides: f } = h;
                            if (((o.allowSlidePrev = !0), (o.allowSlideNext = !0), o.virtual && h.virtual.enabled))
                                return (
                                    s &&
                                        (h.centeredSlides || 0 !== o.snapIndex
                                            ? h.centeredSlides && o.snapIndex < h.slidesPerView
                                                ? o.slideTo(o.virtual.slides.length + o.snapIndex, 0, !1, !0)
                                                : o.snapIndex === o.snapGrid.length - 1 && o.slideTo(o.virtual.slidesBefore, 0, !1, !0)
                                            : o.slideTo(o.virtual.slides.length, 0, !1, !0)),
                                    (o.allowSlidePrev = c),
                                    (o.allowSlideNext = p),
                                    void o.emit("loopFix")
                                );
                            let v = h.slidesPerView;
                            "auto" === v ? (v = o.slidesPerViewDynamic()) : ((v = Math.ceil(parseFloat(h.slidesPerView, 10))), f && v % 2 == 0 && (v += 1));
                            const g = h.slidesPerGroupAuto ? v : h.slidesPerGroup;
                            let w = g;
                            w % g != 0 && (w += g - (w % g)), (w += h.loopAdditionalSlides), (o.loopedSlides = w);
                            const b = o.grid && h.grid && h.grid.rows > 1;
                            d.length < v + w
                                ? m(
                                      "Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled and not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters"
                                  )
                                : b && "row" === h.grid.fill && m("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
                            const S = [],
                                y = [];
                            let T = o.activeIndex;
                            void 0 === n ? (n = o.getSlideIndex(d.filter((e) => e.classList.contains(h.slideActiveClass))[0])) : (T = n);
                            const E = "next" === i || !i,
                                x = "prev" === i || !i;
                            let C = 0,
                                M = 0;
                            const P = b ? Math.ceil(d.length / h.grid.rows) : d.length,
                                L = (b ? d[n].column : n) + (f && void 0 === r ? -v / 2 + 0.5 : 0);
                            if (L < w) {
                                C = Math.max(w - L, g);
                                for (let e = 0; e < w - L; e += 1) {
                                    const t = e - Math.floor(e / P) * P;
                                    if (b) {
                                        const e = P - t - 1;
                                        for (let t = d.length - 1; t >= 0; t -= 1) d[t].column === e && S.push(t);
                                    } else S.push(P - t - 1);
                                }
                            } else if (L + v > P - w) {
                                M = Math.max(L - (P - 2 * w), g);
                                for (let e = 0; e < M; e += 1) {
                                    const t = e - Math.floor(e / P) * P;
                                    b
                                        ? d.forEach((e, s) => {
                                              e.column === t && y.push(s);
                                          })
                                        : y.push(t);
                                }
                            }
                            if (
                                ((o.__preventObserver__ = !0),
                                requestAnimationFrame(() => {
                                    o.__preventObserver__ = !1;
                                }),
                                x &&
                                    S.forEach((e) => {
                                        (d[e].swiperLoopMoveDOM = !0), u.prepend(d[e]), (d[e].swiperLoopMoveDOM = !1);
                                    }),
                                E &&
                                    y.forEach((e) => {
                                        (d[e].swiperLoopMoveDOM = !0), u.append(d[e]), (d[e].swiperLoopMoveDOM = !1);
                                    }),
                                o.recalcSlides(),
                                "auto" === h.slidesPerView
                                    ? o.updateSlides()
                                    : b &&
                                      ((S.length > 0 && x) || (y.length > 0 && E)) &&
                                      o.slides.forEach((e, t) => {
                                          o.grid.updateSlide(t, e, o.slides);
                                      }),
                                h.watchSlidesProgress && o.updateSlidesOffset(),
                                s)
                            )
                                if (S.length > 0 && x) {
                                    if (void 0 === t) {
                                        const e = o.slidesGrid[T],
                                            t = o.slidesGrid[T + C] - e;
                                        l
                                            ? o.setTranslate(o.translate - t)
                                            : (o.slideTo(T + Math.ceil(C), 0, !1, !0),
                                              r && ((o.touchEventsData.startTranslate = o.touchEventsData.startTranslate - t), (o.touchEventsData.currentTranslate = o.touchEventsData.currentTranslate - t)));
                                    } else if (r) {
                                        const e = b ? S.length / h.grid.rows : S.length;
                                        o.slideTo(o.activeIndex + e, 0, !1, !0), (o.touchEventsData.currentTranslate = o.translate);
                                    }
                                } else if (y.length > 0 && E)
                                    if (void 0 === t) {
                                        const e = o.slidesGrid[T],
                                            t = o.slidesGrid[T - M] - e;
                                        l
                                            ? o.setTranslate(o.translate - t)
                                            : (o.slideTo(T - M, 0, !1, !0), r && ((o.touchEventsData.startTranslate = o.touchEventsData.startTranslate - t), (o.touchEventsData.currentTranslate = o.touchEventsData.currentTranslate - t)));
                                    } else {
                                        const e = b ? y.length / h.grid.rows : y.length;
                                        o.slideTo(o.activeIndex - e, 0, !1, !0);
                                    }
                            if (((o.allowSlidePrev = c), (o.allowSlideNext = p), o.controller && o.controller.control && !a)) {
                                const e = { slideRealIndex: t, direction: i, setTranslate: r, activeSlideIndex: n, byController: !0 };
                                Array.isArray(o.controller.control)
                                    ? o.controller.control.forEach((t) => {
                                          !t.destroyed && t.params.loop && t.loopFix({ ...e, slideTo: t.params.slidesPerView === h.slidesPerView && s });
                                      })
                                    : o.controller.control instanceof o.constructor && o.controller.control.params.loop && o.controller.control.loopFix({ ...e, slideTo: o.controller.control.params.slidesPerView === h.slidesPerView && s });
                            }
                            o.emit("loopFix");
                        },
                        loopDestroy: function () {
                            const e = this,
                                { params: t, slidesEl: s } = e;
                            if (!t.loop || (e.virtual && e.params.virtual.enabled)) return;
                            e.recalcSlides();
                            const i = [];
                            e.slides.forEach((e) => {
                                const t = void 0 === e.swiperSlideIndex ? 1 * e.getAttribute("data-swiper-slide-index") : e.swiperSlideIndex;
                                i[t] = e;
                            }),
                                e.slides.forEach((e) => {
                                    e.removeAttribute("data-swiper-slide-index");
                                }),
                                i.forEach((e) => {
                                    s.append(e);
                                }),
                                e.recalcSlides(),
                                e.slideTo(e.realIndex, 0);
                        },
                    };
                function _(e, t, s) {
                    const i = n(),
                        { params: r } = e,
                        a = r.edgeSwipeDetection,
                        l = r.edgeSwipeThreshold;
                    return !a || !(s <= l || s >= i.innerWidth - l) || ("prevent" === a && (t.preventDefault(), !0));
                }
                function D(e) {
                    const t = this,
                        s = i();
                    let r = e;
                    r.originalEvent && (r = r.originalEvent);
                    const a = t.touchEventsData;
                    if ("pointerdown" === r.type) {
                        if (null !== a.pointerId && a.pointerId !== r.pointerId) return;
                        a.pointerId = r.pointerId;
                    } else "touchstart" === r.type && 1 === r.targetTouches.length && (a.touchId = r.targetTouches[0].identifier);
                    if ("touchstart" === r.type) return void _(t, r, r.targetTouches[0].pageX);
                    const { params: o, touches: d, enabled: c } = t;
                    if (!c) return;
                    if (!o.simulateTouch && "mouse" === r.pointerType) return;
                    if (t.animating && o.preventInteractionOnTransition) return;
                    !t.animating && o.cssMode && o.loop && t.loopFix();
                    let p = r.target;
                    if (
                        "wrapper" === o.touchEventsTarget &&
                        !(function (e, t) {
                            const s = t.contains(e);
                            return !s && t instanceof HTMLSlotElement ? [...t.assignedElements()].includes(e) : s;
                        })(p, t.wrapperEl)
                    )
                        return;
                    if ("which" in r && 3 === r.which) return;
                    if ("button" in r && r.button > 0) return;
                    if (a.isTouched && a.isMoved) return;
                    const u = !!o.noSwipingClass && "" !== o.noSwipingClass,
                        m = r.composedPath ? r.composedPath() : r.path;
                    u && r.target && r.target.shadowRoot && m && (p = m[0]);
                    const h = o.noSwipingSelector ? o.noSwipingSelector : `.${o.noSwipingClass}`,
                        f = !(!r.target || !r.target.shadowRoot);
                    if (
                        o.noSwiping &&
                        (f
                            ? (function (e, t) {
                                  return (
                                      void 0 === t && (t = this),
                                      (function t(s) {
                                          if (!s || s === i() || s === n()) return null;
                                          s.assignedSlot && (s = s.assignedSlot);
                                          const r = s.closest(e);
                                          return r || s.getRootNode ? r || t(s.getRootNode().host) : null;
                                      })(t)
                                  );
                              })(h, p)
                            : p.closest(h))
                    )
                        return void (t.allowClick = !0);
                    if (o.swipeHandler && !p.closest(o.swipeHandler)) return;
                    (d.currentX = r.pageX), (d.currentY = r.pageY);
                    const v = d.currentX,
                        g = d.currentY;
                    if (!_(t, r, v)) return;
                    Object.assign(a, { isTouched: !0, isMoved: !1, allowTouchCallbacks: !0, isScrolling: void 0, startMoving: void 0 }),
                        (d.startX = v),
                        (d.startY = g),
                        (a.touchStartTime = l()),
                        (t.allowClick = !0),
                        t.updateSize(),
                        (t.swipeDirection = void 0),
                        o.threshold > 0 && (a.allowThresholdMove = !1);
                    let w = !0;
                    p.matches(a.focusableElements) && ((w = !1), "SELECT" === p.nodeName && (a.isTouched = !1)),
                        s.activeElement && s.activeElement.matches(a.focusableElements) && s.activeElement !== p && ("mouse" === r.pointerType || ("mouse" !== r.pointerType && !p.matches(a.focusableElements))) && s.activeElement.blur();
                    const b = w && t.allowTouchMove && o.touchStartPreventDefault;
                    (!o.touchStartForcePreventDefault && !b) || p.isContentEditable || r.preventDefault(), o.freeMode && o.freeMode.enabled && t.freeMode && t.animating && !o.cssMode && t.freeMode.onTouchStart(), t.emit("touchStart", r);
                }
                function B(e) {
                    const t = i(),
                        s = this,
                        r = s.touchEventsData,
                        { params: n, touches: a, rtlTranslate: o, enabled: d } = s;
                    if (!d) return;
                    if (!n.simulateTouch && "mouse" === e.pointerType) return;
                    let c,
                        p = e;
                    if ((p.originalEvent && (p = p.originalEvent), "pointermove" === p.type)) {
                        if (null !== r.touchId) return;
                        if (p.pointerId !== r.pointerId) return;
                    }
                    if ("touchmove" === p.type) {
                        if (((c = [...p.changedTouches].filter((e) => e.identifier === r.touchId)[0]), !c || c.identifier !== r.touchId)) return;
                    } else c = p;
                    if (!r.isTouched) return void (r.startMoving && r.isScrolling && s.emit("touchMoveOpposite", p));
                    const u = c.pageX,
                        m = c.pageY;
                    if (p.preventedByNestedSwiper) return (a.startX = u), void (a.startY = m);
                    if (!s.allowTouchMove) return p.target.matches(r.focusableElements) || (s.allowClick = !1), void (r.isTouched && (Object.assign(a, { startX: u, startY: m, currentX: u, currentY: m }), (r.touchStartTime = l())));
                    if (n.touchReleaseOnEdges && !n.loop)
                        if (s.isVertical()) {
                            if ((m < a.startY && s.translate <= s.maxTranslate()) || (m > a.startY && s.translate >= s.minTranslate())) return (r.isTouched = !1), void (r.isMoved = !1);
                        } else if ((u < a.startX && s.translate <= s.maxTranslate()) || (u > a.startX && s.translate >= s.minTranslate())) return;
                    if (
                        (t.activeElement && t.activeElement.matches(r.focusableElements) && t.activeElement !== p.target && "mouse" !== p.pointerType && t.activeElement.blur(),
                        t.activeElement && p.target === t.activeElement && p.target.matches(r.focusableElements))
                    )
                        return (r.isMoved = !0), void (s.allowClick = !1);
                    r.allowTouchCallbacks && s.emit("touchMove", p), (a.previousX = a.currentX), (a.previousY = a.currentY), (a.currentX = u), (a.currentY = m);
                    const h = a.currentX - a.startX,
                        f = a.currentY - a.startY;
                    if (s.params.threshold && Math.sqrt(h ** 2 + f ** 2) < s.params.threshold) return;
                    if (void 0 === r.isScrolling) {
                        let e;
                        (s.isHorizontal() && a.currentY === a.startY) || (s.isVertical() && a.currentX === a.startX)
                            ? (r.isScrolling = !1)
                            : h * h + f * f >= 25 && ((e = (180 * Math.atan2(Math.abs(f), Math.abs(h))) / Math.PI), (r.isScrolling = s.isHorizontal() ? e > n.touchAngle : 90 - e > n.touchAngle));
                    }
                    if (
                        (r.isScrolling && s.emit("touchMoveOpposite", p),
                        void 0 === r.startMoving && ((a.currentX === a.startX && a.currentY === a.startY) || (r.startMoving = !0)),
                        r.isScrolling || ("touchmove" === p.type && r.preventTouchMoveFromPointerMove))
                    )
                        return void (r.isTouched = !1);
                    if (!r.startMoving) return;
                    (s.allowClick = !1), !n.cssMode && p.cancelable && p.preventDefault(), n.touchMoveStopPropagation && !n.nested && p.stopPropagation();
                    let v = s.isHorizontal() ? h : f,
                        g = s.isHorizontal() ? a.currentX - a.previousX : a.currentY - a.previousY;
                    n.oneWayMovement && ((v = Math.abs(v) * (o ? 1 : -1)), (g = Math.abs(g) * (o ? 1 : -1))), (a.diff = v), (v *= n.touchRatio), o && ((v = -v), (g = -g));
                    const w = s.touchesDirection;
                    (s.swipeDirection = v > 0 ? "prev" : "next"), (s.touchesDirection = g > 0 ? "prev" : "next");
                    const b = s.params.loop && !n.cssMode,
                        S = ("next" === s.touchesDirection && s.allowSlideNext) || ("prev" === s.touchesDirection && s.allowSlidePrev);
                    if (!r.isMoved) {
                        if ((b && S && s.loopFix({ direction: s.swipeDirection }), (r.startTranslate = s.getTranslate()), s.setTransition(0), s.animating)) {
                            const e = new window.CustomEvent("transitionend", { bubbles: !0, cancelable: !0, detail: { bySwiperTouchMove: !0 } });
                            s.wrapperEl.dispatchEvent(e);
                        }
                        (r.allowMomentumBounce = !1), !n.grabCursor || (!0 !== s.allowSlideNext && !0 !== s.allowSlidePrev) || s.setGrabCursor(!0), s.emit("sliderFirstMove", p);
                    }
                    if ((new Date().getTime(), r.isMoved && r.allowThresholdMove && w !== s.touchesDirection && b && S && Math.abs(v) >= 1))
                        return Object.assign(a, { startX: u, startY: m, currentX: u, currentY: m, startTranslate: r.currentTranslate }), (r.loopSwapReset = !0), void (r.startTranslate = r.currentTranslate);
                    s.emit("sliderMove", p), (r.isMoved = !0), (r.currentTranslate = v + r.startTranslate);
                    let y = !0,
                        T = n.resistanceRatio;
                    if (
                        (n.touchReleaseOnEdges && (T = 0),
                        v > 0
                            ? (b &&
                                  S &&
                                  r.allowThresholdMove &&
                                  r.currentTranslate >
                                      (n.centeredSlides
                                          ? s.minTranslate() -
                                            s.slidesSizesGrid[s.activeIndex + 1] -
                                            ("auto" !== n.slidesPerView && s.slides.length - n.slidesPerView >= 2 ? s.slidesSizesGrid[s.activeIndex + 1] + s.params.spaceBetween : 0) -
                                            s.params.spaceBetween
                                          : s.minTranslate()) &&
                                  s.loopFix({ direction: "prev", setTranslate: !0, activeSlideIndex: 0 }),
                              r.currentTranslate > s.minTranslate() && ((y = !1), n.resistance && (r.currentTranslate = s.minTranslate() - 1 + (-s.minTranslate() + r.startTranslate + v) ** T)))
                            : v < 0 &&
                              (b &&
                                  S &&
                                  r.allowThresholdMove &&
                                  r.currentTranslate <
                                      (n.centeredSlides
                                          ? s.maxTranslate() +
                                            s.slidesSizesGrid[s.slidesSizesGrid.length - 1] +
                                            s.params.spaceBetween +
                                            ("auto" !== n.slidesPerView && s.slides.length - n.slidesPerView >= 2 ? s.slidesSizesGrid[s.slidesSizesGrid.length - 1] + s.params.spaceBetween : 0)
                                          : s.maxTranslate()) &&
                                  s.loopFix({ direction: "next", setTranslate: !0, activeSlideIndex: s.slides.length - ("auto" === n.slidesPerView ? s.slidesPerViewDynamic() : Math.ceil(parseFloat(n.slidesPerView, 10))) }),
                              r.currentTranslate < s.maxTranslate() && ((y = !1), n.resistance && (r.currentTranslate = s.maxTranslate() + 1 - (s.maxTranslate() - r.startTranslate - v) ** T))),
                        y && (p.preventedByNestedSwiper = !0),
                        !s.allowSlideNext && "next" === s.swipeDirection && r.currentTranslate < r.startTranslate && (r.currentTranslate = r.startTranslate),
                        !s.allowSlidePrev && "prev" === s.swipeDirection && r.currentTranslate > r.startTranslate && (r.currentTranslate = r.startTranslate),
                        s.allowSlidePrev || s.allowSlideNext || (r.currentTranslate = r.startTranslate),
                        n.threshold > 0)
                    ) {
                        if (!(Math.abs(v) > n.threshold || r.allowThresholdMove)) return void (r.currentTranslate = r.startTranslate);
                        if (!r.allowThresholdMove)
                            return (r.allowThresholdMove = !0), (a.startX = a.currentX), (a.startY = a.currentY), (r.currentTranslate = r.startTranslate), void (a.diff = s.isHorizontal() ? a.currentX - a.startX : a.currentY - a.startY);
                    }
                    n.followFinger &&
                        !n.cssMode &&
                        (((n.freeMode && n.freeMode.enabled && s.freeMode) || n.watchSlidesProgress) && (s.updateActiveIndex(), s.updateSlidesClasses()),
                        n.freeMode && n.freeMode.enabled && s.freeMode && s.freeMode.onTouchMove(),
                        s.updateProgress(r.currentTranslate),
                        s.setTranslate(r.currentTranslate));
                }
                function $(e) {
                    const t = this,
                        s = t.touchEventsData;
                    let i,
                        r = e;
                    if ((r.originalEvent && (r = r.originalEvent), "touchend" === r.type || "touchcancel" === r.type)) {
                        if (((i = [...r.changedTouches].filter((e) => e.identifier === s.touchId)[0]), !i || i.identifier !== s.touchId)) return;
                    } else {
                        if (null !== s.touchId) return;
                        if (r.pointerId !== s.pointerId) return;
                        i = r;
                    }
                    if (["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(r.type) && (!["pointercancel", "contextmenu"].includes(r.type) || (!t.browser.isSafari && !t.browser.isWebView))) return;
                    (s.pointerId = null), (s.touchId = null);
                    const { params: n, touches: o, rtlTranslate: d, slidesGrid: c, enabled: p } = t;
                    if (!p) return;
                    if (!n.simulateTouch && "mouse" === r.pointerType) return;
                    if ((s.allowTouchCallbacks && t.emit("touchEnd", r), (s.allowTouchCallbacks = !1), !s.isTouched)) return s.isMoved && n.grabCursor && t.setGrabCursor(!1), (s.isMoved = !1), void (s.startMoving = !1);
                    n.grabCursor && s.isMoved && s.isTouched && (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) && t.setGrabCursor(!1);
                    const u = l(),
                        m = u - s.touchStartTime;
                    if (t.allowClick) {
                        const e = r.path || (r.composedPath && r.composedPath());
                        t.updateClickedSlide((e && e[0]) || r.target, e), t.emit("tap click", r), m < 300 && u - s.lastClickTime < 300 && t.emit("doubleTap doubleClick", r);
                    }
                    if (
                        ((s.lastClickTime = l()),
                        a(() => {
                            t.destroyed || (t.allowClick = !0);
                        }),
                        !s.isTouched || !s.isMoved || !t.swipeDirection || (0 === o.diff && !s.loopSwapReset) || (s.currentTranslate === s.startTranslate && !s.loopSwapReset))
                    )
                        return (s.isTouched = !1), (s.isMoved = !1), void (s.startMoving = !1);
                    let h;
                    if (((s.isTouched = !1), (s.isMoved = !1), (s.startMoving = !1), (h = n.followFinger ? (d ? t.translate : -t.translate) : -s.currentTranslate), n.cssMode)) return;
                    if (n.freeMode && n.freeMode.enabled) return void t.freeMode.onTouchEnd({ currentPos: h });
                    const f = h >= -t.maxTranslate() && !t.params.loop;
                    let v = 0,
                        g = t.slidesSizesGrid[0];
                    for (let e = 0; e < c.length; e += e < n.slidesPerGroupSkip ? 1 : n.slidesPerGroup) {
                        const t = e < n.slidesPerGroupSkip - 1 ? 1 : n.slidesPerGroup;
                        void 0 !== c[e + t] ? (f || (h >= c[e] && h < c[e + t])) && ((v = e), (g = c[e + t] - c[e])) : (f || h >= c[e]) && ((v = e), (g = c[c.length - 1] - c[c.length - 2]));
                    }
                    let w = null,
                        b = null;
                    n.rewind && (t.isBeginning ? (b = n.virtual && n.virtual.enabled && t.virtual ? t.virtual.slides.length - 1 : t.slides.length - 1) : t.isEnd && (w = 0));
                    const S = (h - c[v]) / g,
                        y = v < n.slidesPerGroupSkip - 1 ? 1 : n.slidesPerGroup;
                    if (m > n.longSwipesMs) {
                        if (!n.longSwipes) return void t.slideTo(t.activeIndex);
                        "next" === t.swipeDirection && (S >= n.longSwipesRatio ? t.slideTo(n.rewind && t.isEnd ? w : v + y) : t.slideTo(v)),
                            "prev" === t.swipeDirection && (S > 1 - n.longSwipesRatio ? t.slideTo(v + y) : null !== b && S < 0 && Math.abs(S) > n.longSwipesRatio ? t.slideTo(b) : t.slideTo(v));
                    } else {
                        if (!n.shortSwipes) return void t.slideTo(t.activeIndex);
                        !t.navigation || (r.target !== t.navigation.nextEl && r.target !== t.navigation.prevEl)
                            ? ("next" === t.swipeDirection && t.slideTo(null !== w ? w : v + y), "prev" === t.swipeDirection && t.slideTo(null !== b ? b : v))
                            : r.target === t.navigation.nextEl
                            ? t.slideTo(v + y)
                            : t.slideTo(v);
                    }
                }
                function V() {
                    const e = this,
                        { params: t, el: s } = e;
                    if (s && 0 === s.offsetWidth) return;
                    t.breakpoints && e.setBreakpoint();
                    const { allowSlideNext: i, allowSlidePrev: r, snapGrid: n } = e,
                        a = e.virtual && e.params.virtual.enabled;
                    (e.allowSlideNext = !0), (e.allowSlidePrev = !0), e.updateSize(), e.updateSlides(), e.updateSlidesClasses();
                    const l = a && t.loop;
                    !("auto" === t.slidesPerView || t.slidesPerView > 1) || !e.isEnd || e.isBeginning || e.params.centeredSlides || l
                        ? e.params.loop && !a
                            ? e.slideToLoop(e.realIndex, 0, !1, !0)
                            : e.slideTo(e.activeIndex, 0, !1, !0)
                        : e.slideTo(e.slides.length - 1, 0, !1, !0),
                        e.autoplay &&
                            e.autoplay.running &&
                            e.autoplay.paused &&
                            (clearTimeout(e.autoplay.resizeTimeout),
                            (e.autoplay.resizeTimeout = setTimeout(() => {
                                e.autoplay && e.autoplay.running && e.autoplay.paused && e.autoplay.resume();
                            }, 500))),
                        (e.allowSlidePrev = r),
                        (e.allowSlideNext = i),
                        e.params.watchOverflow && n !== e.snapGrid && e.checkOverflow();
                }
                function N(e) {
                    const t = this;
                    t.enabled && (t.allowClick || (t.params.preventClicks && e.preventDefault(), t.params.preventClicksPropagation && t.animating && (e.stopPropagation(), e.stopImmediatePropagation())));
                }
                function F() {
                    const e = this,
                        { wrapperEl: t, rtlTranslate: s, enabled: i } = e;
                    if (!i) return;
                    let r;
                    (e.previousTranslate = e.translate), e.isHorizontal() ? (e.translate = -t.scrollLeft) : (e.translate = -t.scrollTop), 0 === e.translate && (e.translate = 0), e.updateActiveIndex(), e.updateSlidesClasses();
                    const n = e.maxTranslate() - e.minTranslate();
                    (r = 0 === n ? 0 : (e.translate - e.minTranslate()) / n), r !== e.progress && e.updateProgress(s ? -e.translate : e.translate), e.emit("setTranslate", e.translate, !1);
                }
                function H(e) {
                    const t = this;
                    L(t, e.target), t.params.cssMode || ("auto" !== t.params.slidesPerView && !t.params.autoHeight) || t.update();
                }
                function q() {
                    const e = this;
                    e.documentTouchHandlerProceeded || ((e.documentTouchHandlerProceeded = !0), e.params.touchReleaseOnEdges && (e.el.style.touchAction = "auto"));
                }
                const j = (e, t) => {
                        const s = i(),
                            { params: r, el: n, wrapperEl: a, device: l } = e,
                            o = !!r.nested,
                            d = "on" === t ? "addEventListener" : "removeEventListener",
                            c = t;
                        n &&
                            "string" != typeof n &&
                            (s[d]("touchstart", e.onDocumentTouchStart, { passive: !1, capture: o }),
                            n[d]("touchstart", e.onTouchStart, { passive: !1 }),
                            n[d]("pointerdown", e.onTouchStart, { passive: !1 }),
                            s[d]("touchmove", e.onTouchMove, { passive: !1, capture: o }),
                            s[d]("pointermove", e.onTouchMove, { passive: !1, capture: o }),
                            s[d]("touchend", e.onTouchEnd, { passive: !0 }),
                            s[d]("pointerup", e.onTouchEnd, { passive: !0 }),
                            s[d]("pointercancel", e.onTouchEnd, { passive: !0 }),
                            s[d]("touchcancel", e.onTouchEnd, { passive: !0 }),
                            s[d]("pointerout", e.onTouchEnd, { passive: !0 }),
                            s[d]("pointerleave", e.onTouchEnd, { passive: !0 }),
                            s[d]("contextmenu", e.onTouchEnd, { passive: !0 }),
                            (r.preventClicks || r.preventClicksPropagation) && n[d]("click", e.onClick, !0),
                            r.cssMode && a[d]("scroll", e.onScroll),
                            r.updateOnWindowResize ? e[c](l.ios || l.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", V, !0) : e[c]("observerUpdate", V, !0),
                            n[d]("load", e.onLoad, { capture: !0 }));
                    },
                    R = (e, t) => e.grid && t.grid && t.grid.rows > 1;
                var W = {
                    init: !0,
                    direction: "horizontal",
                    oneWayMovement: !1,
                    swiperElementNodeName: "SWIPER-CONTAINER",
                    touchEventsTarget: "wrapper",
                    initialSlide: 0,
                    speed: 300,
                    cssMode: !1,
                    updateOnWindowResize: !0,
                    resizeObserver: !0,
                    nested: !1,
                    createElements: !1,
                    eventsPrefix: "swiper",
                    enabled: !0,
                    focusableElements: "input, select, option, textarea, button, video, label",
                    width: null,
                    height: null,
                    preventInteractionOnTransition: !1,
                    userAgent: null,
                    url: null,
                    edgeSwipeDetection: !1,
                    edgeSwipeThreshold: 20,
                    autoHeight: !1,
                    setWrapperSize: !1,
                    virtualTranslate: !1,
                    effect: "slide",
                    breakpoints: void 0,
                    breakpointsBase: "window",
                    spaceBetween: 0,
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    slidesPerGroupSkip: 0,
                    slidesPerGroupAuto: !1,
                    centeredSlides: !1,
                    centeredSlidesBounds: !1,
                    slidesOffsetBefore: 0,
                    slidesOffsetAfter: 0,
                    normalizeSlideIndex: !0,
                    centerInsufficientSlides: !1,
                    watchOverflow: !0,
                    roundLengths: !1,
                    touchRatio: 1,
                    touchAngle: 45,
                    simulateTouch: !0,
                    shortSwipes: !0,
                    longSwipes: !0,
                    longSwipesRatio: 0.5,
                    longSwipesMs: 300,
                    followFinger: !0,
                    allowTouchMove: !0,
                    threshold: 5,
                    touchMoveStopPropagation: !1,
                    touchStartPreventDefault: !0,
                    touchStartForcePreventDefault: !1,
                    touchReleaseOnEdges: !1,
                    uniqueNavElements: !0,
                    resistance: !0,
                    resistanceRatio: 0.85,
                    watchSlidesProgress: !1,
                    grabCursor: !1,
                    preventClicks: !0,
                    preventClicksPropagation: !0,
                    slideToClickedSlide: !1,
                    loop: !1,
                    loopAddBlankSlides: !0,
                    loopAdditionalSlides: 0,
                    loopPreventsSliding: !0,
                    rewind: !1,
                    allowSlidePrev: !0,
                    allowSlideNext: !0,
                    swipeHandler: null,
                    noSwiping: !0,
                    noSwipingClass: "swiper-no-swiping",
                    noSwipingSelector: null,
                    passiveListeners: !0,
                    maxBackfaceHiddenSlides: 10,
                    containerModifierClass: "swiper-",
                    slideClass: "swiper-slide",
                    slideBlankClass: "swiper-slide-blank",
                    slideActiveClass: "swiper-slide-active",
                    slideVisibleClass: "swiper-slide-visible",
                    slideFullyVisibleClass: "swiper-slide-fully-visible",
                    slideNextClass: "swiper-slide-next",
                    slidePrevClass: "swiper-slide-prev",
                    wrapperClass: "swiper-wrapper",
                    lazyPreloaderClass: "swiper-lazy-preloader",
                    lazyPreloadPrevNext: 0,
                    runCallbacksOnInit: !0,
                    _emitClasses: !1,
                };
                function Y(e, t) {
                    return function (s) {
                        void 0 === s && (s = {});
                        const i = Object.keys(s)[0],
                            r = s[i];
                        "object" == typeof r && null !== r
                            ? (!0 === e[i] && (e[i] = { enabled: !0 }),
                              "navigation" === i && e[i] && e[i].enabled && !e[i].prevEl && !e[i].nextEl && (e[i].auto = !0),
                              ["pagination", "scrollbar"].indexOf(i) >= 0 && e[i] && e[i].enabled && !e[i].el && (e[i].auto = !0),
                              i in e && "enabled" in r ? ("object" != typeof e[i] || "enabled" in e[i] || (e[i].enabled = !0), e[i] || (e[i] = { enabled: !1 }), d(t, s)) : d(t, s))
                            : d(t, s);
                    };
                }
                const X = {
                        eventsEmitter: C,
                        update: A,
                        translate: {
                            getTranslate: function (e) {
                                void 0 === e && (e = this.isHorizontal() ? "x" : "y");
                                const { params: t, rtlTranslate: s, translate: i, wrapperEl: r } = this;
                                if (t.virtualTranslate) return s ? -i : i;
                                if (t.cssMode) return i;
                                let a = (function (e, t) {
                                    void 0 === t && (t = "x");
                                    const s = n();
                                    let i, r, a;
                                    const l = (function (e) {
                                        const t = n();
                                        let s;
                                        return t.getComputedStyle && (s = t.getComputedStyle(e, null)), !s && e.currentStyle && (s = e.currentStyle), s || (s = e.style), s;
                                    })(e);
                                    return (
                                        s.WebKitCSSMatrix
                                            ? ((r = l.transform || l.webkitTransform),
                                              r.split(",").length > 6 &&
                                                  (r = r
                                                      .split(", ")
                                                      .map((e) => e.replace(",", "."))
                                                      .join(", ")),
                                              (a = new s.WebKitCSSMatrix("none" === r ? "" : r)))
                                            : ((a = l.MozTransform || l.OTransform || l.MsTransform || l.msTransform || l.transform || l.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,")),
                                              (i = a.toString().split(","))),
                                        "x" === t && (r = s.WebKitCSSMatrix ? a.m41 : 16 === i.length ? parseFloat(i[12]) : parseFloat(i[4])),
                                        "y" === t && (r = s.WebKitCSSMatrix ? a.m42 : 16 === i.length ? parseFloat(i[13]) : parseFloat(i[5])),
                                        r || 0
                                    );
                                })(r, e);
                                return (a += this.cssOverflowAdjustment()), s && (a = -a), a || 0;
                            },
                            setTranslate: function (e, t) {
                                const s = this,
                                    { rtlTranslate: i, params: r, wrapperEl: n, progress: a } = s;
                                let l,
                                    o = 0,
                                    d = 0;
                                s.isHorizontal() ? (o = i ? -e : e) : (d = e),
                                    r.roundLengths && ((o = Math.floor(o)), (d = Math.floor(d))),
                                    (s.previousTranslate = s.translate),
                                    (s.translate = s.isHorizontal() ? o : d),
                                    r.cssMode
                                        ? (n[s.isHorizontal() ? "scrollLeft" : "scrollTop"] = s.isHorizontal() ? -o : -d)
                                        : r.virtualTranslate || (s.isHorizontal() ? (o -= s.cssOverflowAdjustment()) : (d -= s.cssOverflowAdjustment()), (n.style.transform = `translate3d(${o}px, ${d}px, 0px)`));
                                const c = s.maxTranslate() - s.minTranslate();
                                (l = 0 === c ? 0 : (e - s.minTranslate()) / c), l !== a && s.updateProgress(e), s.emit("setTranslate", s.translate, t);
                            },
                            minTranslate: function () {
                                return -this.snapGrid[0];
                            },
                            maxTranslate: function () {
                                return -this.snapGrid[this.snapGrid.length - 1];
                            },
                            translateTo: function (e, t, s, i, r) {
                                void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0), void 0 === i && (i = !0);
                                const n = this,
                                    { params: a, wrapperEl: l } = n;
                                if (n.animating && a.preventInteractionOnTransition) return !1;
                                const o = n.minTranslate(),
                                    d = n.maxTranslate();
                                let c;
                                if (((c = i && e > o ? o : i && e < d ? d : e), n.updateProgress(c), a.cssMode)) {
                                    const e = n.isHorizontal();
                                    if (0 === t) l[e ? "scrollLeft" : "scrollTop"] = -c;
                                    else {
                                        if (!n.support.smoothScroll) return p({ swiper: n, targetPosition: -c, side: e ? "left" : "top" }), !0;
                                        l.scrollTo({ [e ? "left" : "top"]: -c, behavior: "smooth" });
                                    }
                                    return !0;
                                }
                                return (
                                    0 === t
                                        ? (n.setTransition(0), n.setTranslate(c), s && (n.emit("beforeTransitionStart", t, r), n.emit("transitionEnd")))
                                        : (n.setTransition(t),
                                          n.setTranslate(c),
                                          s && (n.emit("beforeTransitionStart", t, r), n.emit("transitionStart")),
                                          n.animating ||
                                              ((n.animating = !0),
                                              n.onTranslateToWrapperTransitionEnd ||
                                                  (n.onTranslateToWrapperTransitionEnd = function (e) {
                                                      n &&
                                                          !n.destroyed &&
                                                          e.target === this &&
                                                          (n.wrapperEl.removeEventListener("transitionend", n.onTranslateToWrapperTransitionEnd),
                                                          (n.onTranslateToWrapperTransitionEnd = null),
                                                          delete n.onTranslateToWrapperTransitionEnd,
                                                          (n.animating = !1),
                                                          s && n.emit("transitionEnd"));
                                                  }),
                                              n.wrapperEl.addEventListener("transitionend", n.onTranslateToWrapperTransitionEnd))),
                                    !0
                                );
                            },
                        },
                        transition: {
                            setTransition: function (e, t) {
                                const s = this;
                                s.params.cssMode || ((s.wrapperEl.style.transitionDuration = `${e}ms`), (s.wrapperEl.style.transitionDelay = 0 === e ? "0ms" : "")), s.emit("setTransition", e, t);
                            },
                            transitionStart: function (e, t) {
                                void 0 === e && (e = !0);
                                const s = this,
                                    { params: i } = s;
                                i.cssMode || (i.autoHeight && s.updateAutoHeight(), O({ swiper: s, runCallbacks: e, direction: t, step: "Start" }));
                            },
                            transitionEnd: function (e, t) {
                                void 0 === e && (e = !0);
                                const s = this,
                                    { params: i } = s;
                                (s.animating = !1), i.cssMode || (s.setTransition(0), O({ swiper: s, runCallbacks: e, direction: t, step: "End" }));
                            },
                        },
                        slide: z,
                        loop: G,
                        grabCursor: {
                            setGrabCursor: function (e) {
                                const t = this;
                                if (!t.params.simulateTouch || (t.params.watchOverflow && t.isLocked) || t.params.cssMode) return;
                                const s = "container" === t.params.touchEventsTarget ? t.el : t.wrapperEl;
                                t.isElement && (t.__preventObserver__ = !0),
                                    (s.style.cursor = "move"),
                                    (s.style.cursor = e ? "grabbing" : "grab"),
                                    t.isElement &&
                                        requestAnimationFrame(() => {
                                            t.__preventObserver__ = !1;
                                        });
                            },
                            unsetGrabCursor: function () {
                                const e = this;
                                (e.params.watchOverflow && e.isLocked) ||
                                    e.params.cssMode ||
                                    (e.isElement && (e.__preventObserver__ = !0),
                                    (e["container" === e.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = ""),
                                    e.isElement &&
                                        requestAnimationFrame(() => {
                                            e.__preventObserver__ = !1;
                                        }));
                            },
                        },
                        events: {
                            attachEvents: function () {
                                const e = this,
                                    { params: t } = e;
                                (e.onTouchStart = D.bind(e)),
                                    (e.onTouchMove = B.bind(e)),
                                    (e.onTouchEnd = $.bind(e)),
                                    (e.onDocumentTouchStart = q.bind(e)),
                                    t.cssMode && (e.onScroll = F.bind(e)),
                                    (e.onClick = N.bind(e)),
                                    (e.onLoad = H.bind(e)),
                                    j(e, "on");
                            },
                            detachEvents: function () {
                                j(this, "off");
                            },
                        },
                        breakpoints: {
                            setBreakpoint: function () {
                                const e = this,
                                    { realIndex: t, initialized: s, params: i, el: r } = e,
                                    n = i.breakpoints;
                                if (!n || (n && 0 === Object.keys(n).length)) return;
                                const a = e.getBreakpoint(n, e.params.breakpointsBase, e.el);
                                if (!a || e.currentBreakpoint === a) return;
                                const l = (a in n ? n[a] : void 0) || e.originalParams,
                                    o = R(e, i),
                                    c = R(e, l),
                                    p = e.params.grabCursor,
                                    u = l.grabCursor,
                                    m = i.enabled;
                                o && !c
                                    ? (r.classList.remove(`${i.containerModifierClass}grid`, `${i.containerModifierClass}grid-column`), e.emitContainerClasses())
                                    : !o &&
                                      c &&
                                      (r.classList.add(`${i.containerModifierClass}grid`),
                                      ((l.grid.fill && "column" === l.grid.fill) || (!l.grid.fill && "column" === i.grid.fill)) && r.classList.add(`${i.containerModifierClass}grid-column`),
                                      e.emitContainerClasses()),
                                    p && !u ? e.unsetGrabCursor() : !p && u && e.setGrabCursor(),
                                    ["navigation", "pagination", "scrollbar"].forEach((t) => {
                                        if (void 0 === l[t]) return;
                                        const s = i[t] && i[t].enabled,
                                            r = l[t] && l[t].enabled;
                                        s && !r && e[t].disable(), !s && r && e[t].enable();
                                    });
                                const h = l.direction && l.direction !== i.direction,
                                    f = i.loop && (l.slidesPerView !== i.slidesPerView || h),
                                    v = i.loop;
                                h && s && e.changeDirection(), d(e.params, l);
                                const g = e.params.enabled,
                                    w = e.params.loop;
                                Object.assign(e, { allowTouchMove: e.params.allowTouchMove, allowSlideNext: e.params.allowSlideNext, allowSlidePrev: e.params.allowSlidePrev }),
                                    m && !g ? e.disable() : !m && g && e.enable(),
                                    (e.currentBreakpoint = a),
                                    e.emit("_beforeBreakpoint", l),
                                    s && (f ? (e.loopDestroy(), e.loopCreate(t), e.updateSlides()) : !v && w ? (e.loopCreate(t), e.updateSlides()) : v && !w && e.loopDestroy()),
                                    e.emit("breakpoint", l);
                            },
                            getBreakpoint: function (e, t, s) {
                                if ((void 0 === t && (t = "window"), !e || ("container" === t && !s))) return;
                                let i = !1;
                                const r = n(),
                                    a = "window" === t ? r.innerHeight : s.clientHeight,
                                    l = Object.keys(e).map((e) => {
                                        if ("string" == typeof e && 0 === e.indexOf("@")) {
                                            const t = parseFloat(e.substr(1));
                                            return { value: a * t, point: e };
                                        }
                                        return { value: e, point: e };
                                    });
                                l.sort((e, t) => parseInt(e.value, 10) - parseInt(t.value, 10));
                                for (let e = 0; e < l.length; e += 1) {
                                    const { point: n, value: a } = l[e];
                                    "window" === t ? r.matchMedia(`(min-width: ${a}px)`).matches && (i = n) : a <= s.clientWidth && (i = n);
                                }
                                return i || "max";
                            },
                        },
                        checkOverflow: {
                            checkOverflow: function () {
                                const e = this,
                                    { isLocked: t, params: s } = e,
                                    { slidesOffsetBefore: i } = s;
                                if (i) {
                                    const t = e.slides.length - 1,
                                        s = e.slidesGrid[t] + e.slidesSizesGrid[t] + 2 * i;
                                    e.isLocked = e.size > s;
                                } else e.isLocked = 1 === e.snapGrid.length;
                                !0 === s.allowSlideNext && (e.allowSlideNext = !e.isLocked),
                                    !0 === s.allowSlidePrev && (e.allowSlidePrev = !e.isLocked),
                                    t && t !== e.isLocked && (e.isEnd = !1),
                                    t !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock");
                            },
                        },
                        classes: {
                            addClasses: function () {
                                const e = this,
                                    { classNames: t, params: s, rtl: i, el: r, device: n } = e,
                                    a = (function (e, t) {
                                        const s = [];
                                        return (
                                            e.forEach((e) => {
                                                "object" == typeof e
                                                    ? Object.keys(e).forEach((i) => {
                                                          e[i] && s.push(t + i);
                                                      })
                                                    : "string" == typeof e && s.push(t + e);
                                            }),
                                            s
                                        );
                                    })(
                                        [
                                            "initialized",
                                            s.direction,
                                            { "free-mode": e.params.freeMode && s.freeMode.enabled },
                                            { autoheight: s.autoHeight },
                                            { rtl: i },
                                            { grid: s.grid && s.grid.rows > 1 },
                                            { "grid-column": s.grid && s.grid.rows > 1 && "column" === s.grid.fill },
                                            { android: n.android },
                                            { ios: n.ios },
                                            { "css-mode": s.cssMode },
                                            { centered: s.cssMode && s.centeredSlides },
                                            { "watch-progress": s.watchSlidesProgress },
                                        ],
                                        s.containerModifierClass
                                    );
                                t.push(...a), r.classList.add(...t), e.emitContainerClasses();
                            },
                            removeClasses: function () {
                                const { el: e, classNames: t } = this;
                                e && "string" != typeof e && (e.classList.remove(...t), this.emitContainerClasses());
                            },
                        },
                    },
                    U = {};
                class K {
                    constructor() {
                        let e, t;
                        for (var s = arguments.length, r = new Array(s), a = 0; a < s; a++) r[a] = arguments[a];
                        1 === r.length && r[0].constructor && "Object" === Object.prototype.toString.call(r[0]).slice(8, -1) ? (t = r[0]) : ([e, t] = r), t || (t = {}), (t = d({}, t)), e && !t.el && (t.el = e);
                        const l = i();
                        if (t.el && "string" == typeof t.el && l.querySelectorAll(t.el).length > 1) {
                            const e = [];
                            return (
                                l.querySelectorAll(t.el).forEach((s) => {
                                    const i = d({}, t, { el: s });
                                    e.push(new K(i));
                                }),
                                e
                            );
                        }
                        const o = this;
                        (o.__swiper__ = !0),
                            (o.support = E()),
                            (o.device = x({ userAgent: t.userAgent })),
                            (o.browser =
                                (T ||
                                    (T = (function () {
                                        const e = n(),
                                            t = x();
                                        let s = !1;
                                        function i() {
                                            const t = e.navigator.userAgent.toLowerCase();
                                            return t.indexOf("safari") >= 0 && t.indexOf("chrome") < 0 && t.indexOf("android") < 0;
                                        }
                                        if (i()) {
                                            const t = String(e.navigator.userAgent);
                                            if (t.includes("Version/")) {
                                                const [e, i] = t
                                                    .split("Version/")[1]
                                                    .split(" ")[0]
                                                    .split(".")
                                                    .map((e) => Number(e));
                                                s = e < 16 || (16 === e && i < 2);
                                            }
                                        }
                                        const r = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(e.navigator.userAgent),
                                            a = i();
                                        return { isSafari: s || a, needPerspectiveFix: s, need3dFix: a || (r && t.ios), isWebView: r };
                                    })()),
                                T)),
                            (o.eventsListeners = {}),
                            (o.eventsAnyListeners = []),
                            (o.modules = [...o.__modules__]),
                            t.modules && Array.isArray(t.modules) && o.modules.push(...t.modules);
                        const c = {};
                        o.modules.forEach((e) => {
                            e({ params: t, swiper: o, extendParams: Y(t, c), on: o.on.bind(o), once: o.once.bind(o), off: o.off.bind(o), emit: o.emit.bind(o) });
                        });
                        const p = d({}, W, c);
                        return (
                            (o.params = d({}, p, U, t)),
                            (o.originalParams = d({}, o.params)),
                            (o.passedParams = d({}, t)),
                            o.params &&
                                o.params.on &&
                                Object.keys(o.params.on).forEach((e) => {
                                    o.on(e, o.params.on[e]);
                                }),
                            o.params && o.params.onAny && o.onAny(o.params.onAny),
                            Object.assign(o, {
                                enabled: o.params.enabled,
                                el: e,
                                classNames: [],
                                slides: [],
                                slidesGrid: [],
                                snapGrid: [],
                                slidesSizesGrid: [],
                                isHorizontal: () => "horizontal" === o.params.direction,
                                isVertical: () => "vertical" === o.params.direction,
                                activeIndex: 0,
                                realIndex: 0,
                                isBeginning: !0,
                                isEnd: !1,
                                translate: 0,
                                previousTranslate: 0,
                                progress: 0,
                                velocity: 0,
                                animating: !1,
                                cssOverflowAdjustment() {
                                    return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
                                },
                                allowSlideNext: o.params.allowSlideNext,
                                allowSlidePrev: o.params.allowSlidePrev,
                                touchEventsData: {
                                    isTouched: void 0,
                                    isMoved: void 0,
                                    allowTouchCallbacks: void 0,
                                    touchStartTime: void 0,
                                    isScrolling: void 0,
                                    currentTranslate: void 0,
                                    startTranslate: void 0,
                                    allowThresholdMove: void 0,
                                    focusableElements: o.params.focusableElements,
                                    lastClickTime: 0,
                                    clickTimeout: void 0,
                                    velocities: [],
                                    allowMomentumBounce: void 0,
                                    startMoving: void 0,
                                    pointerId: null,
                                    touchId: null,
                                },
                                allowClick: !0,
                                allowTouchMove: o.params.allowTouchMove,
                                touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 },
                                imagesToLoad: [],
                                imagesLoaded: 0,
                            }),
                            o.emit("_swiper"),
                            o.params.init && o.init(),
                            o
                        );
                    }
                    getDirectionLabel(e) {
                        return this.isHorizontal()
                            ? e
                            : {
                                  width: "height",
                                  "margin-top": "margin-left",
                                  "margin-bottom ": "margin-right",
                                  "margin-left": "margin-top",
                                  "margin-right": "margin-bottom",
                                  "padding-left": "padding-top",
                                  "padding-right": "padding-bottom",
                                  marginRight: "marginBottom",
                              }[e];
                    }
                    getSlideIndex(e) {
                        const { slidesEl: t, params: s } = this,
                            i = v(u(t, `.${s.slideClass}, swiper-slide`)[0]);
                        return v(e) - i;
                    }
                    getSlideIndexByData(e) {
                        return this.getSlideIndex(this.slides.filter((t) => 1 * t.getAttribute("data-swiper-slide-index") === e)[0]);
                    }
                    recalcSlides() {
                        const { slidesEl: e, params: t } = this;
                        this.slides = u(e, `.${t.slideClass}, swiper-slide`);
                    }
                    enable() {
                        const e = this;
                        e.enabled || ((e.enabled = !0), e.params.grabCursor && e.setGrabCursor(), e.emit("enable"));
                    }
                    disable() {
                        const e = this;
                        e.enabled && ((e.enabled = !1), e.params.grabCursor && e.unsetGrabCursor(), e.emit("disable"));
                    }
                    setProgress(e, t) {
                        const s = this;
                        e = Math.min(Math.max(e, 0), 1);
                        const i = s.minTranslate(),
                            r = (s.maxTranslate() - i) * e + i;
                        s.translateTo(r, void 0 === t ? 0 : t), s.updateActiveIndex(), s.updateSlidesClasses();
                    }
                    emitContainerClasses() {
                        const e = this;
                        if (!e.params._emitClasses || !e.el) return;
                        const t = e.el.className.split(" ").filter((t) => 0 === t.indexOf("swiper") || 0 === t.indexOf(e.params.containerModifierClass));
                        e.emit("_containerClasses", t.join(" "));
                    }
                    getSlideClasses(e) {
                        const t = this;
                        return t.destroyed
                            ? ""
                            : e.className
                                  .split(" ")
                                  .filter((e) => 0 === e.indexOf("swiper-slide") || 0 === e.indexOf(t.params.slideClass))
                                  .join(" ");
                    }
                    emitSlidesClasses() {
                        const e = this;
                        if (!e.params._emitClasses || !e.el) return;
                        const t = [];
                        e.slides.forEach((s) => {
                            const i = e.getSlideClasses(s);
                            t.push({ slideEl: s, classNames: i }), e.emit("_slideClass", s, i);
                        }),
                            e.emit("_slideClasses", t);
                    }
                    slidesPerViewDynamic(e, t) {
                        void 0 === e && (e = "current"), void 0 === t && (t = !1);
                        const { params: s, slides: i, slidesGrid: r, slidesSizesGrid: n, size: a, activeIndex: l } = this;
                        let o = 1;
                        if ("number" == typeof s.slidesPerView) return s.slidesPerView;
                        if (s.centeredSlides) {
                            let e,
                                t = i[l] ? Math.ceil(i[l].swiperSlideSize) : 0;
                            for (let s = l + 1; s < i.length; s += 1) i[s] && !e && ((t += Math.ceil(i[s].swiperSlideSize)), (o += 1), t > a && (e = !0));
                            for (let s = l - 1; s >= 0; s -= 1) i[s] && !e && ((t += i[s].swiperSlideSize), (o += 1), t > a && (e = !0));
                        } else if ("current" === e) for (let e = l + 1; e < i.length; e += 1) (t ? r[e] + n[e] - r[l] < a : r[e] - r[l] < a) && (o += 1);
                        else for (let e = l - 1; e >= 0; e -= 1) r[l] - r[e] < a && (o += 1);
                        return o;
                    }
                    update() {
                        const e = this;
                        if (!e || e.destroyed) return;
                        const { snapGrid: t, params: s } = e;
                        function i() {
                            const t = e.rtlTranslate ? -1 * e.translate : e.translate,
                                s = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
                            e.setTranslate(s), e.updateActiveIndex(), e.updateSlidesClasses();
                        }
                        let r;
                        if (
                            (s.breakpoints && e.setBreakpoint(),
                            [...e.el.querySelectorAll('[loading="lazy"]')].forEach((t) => {
                                t.complete && L(e, t);
                            }),
                            e.updateSize(),
                            e.updateSlides(),
                            e.updateProgress(),
                            e.updateSlidesClasses(),
                            s.freeMode && s.freeMode.enabled && !s.cssMode)
                        )
                            i(), s.autoHeight && e.updateAutoHeight();
                        else {
                            if (("auto" === s.slidesPerView || s.slidesPerView > 1) && e.isEnd && !s.centeredSlides) {
                                const t = e.virtual && s.virtual.enabled ? e.virtual.slides : e.slides;
                                r = e.slideTo(t.length - 1, 0, !1, !0);
                            } else r = e.slideTo(e.activeIndex, 0, !1, !0);
                            r || i();
                        }
                        s.watchOverflow && t !== e.snapGrid && e.checkOverflow(), e.emit("update");
                    }
                    changeDirection(e, t) {
                        void 0 === t && (t = !0);
                        const s = this,
                            i = s.params.direction;
                        return (
                            e || (e = "horizontal" === i ? "vertical" : "horizontal"),
                            e === i ||
                                ("horizontal" !== e && "vertical" !== e) ||
                                (s.el.classList.remove(`${s.params.containerModifierClass}${i}`),
                                s.el.classList.add(`${s.params.containerModifierClass}${e}`),
                                s.emitContainerClasses(),
                                (s.params.direction = e),
                                s.slides.forEach((t) => {
                                    "vertical" === e ? (t.style.width = "") : (t.style.height = "");
                                }),
                                s.emit("changeDirection"),
                                t && s.update()),
                            s
                        );
                    }
                    changeLanguageDirection(e) {
                        const t = this;
                        (t.rtl && "rtl" === e) ||
                            (!t.rtl && "ltr" === e) ||
                            ((t.rtl = "rtl" === e),
                            (t.rtlTranslate = "horizontal" === t.params.direction && t.rtl),
                            t.rtl ? (t.el.classList.add(`${t.params.containerModifierClass}rtl`), (t.el.dir = "rtl")) : (t.el.classList.remove(`${t.params.containerModifierClass}rtl`), (t.el.dir = "ltr")),
                            t.update());
                    }
                    mount(e) {
                        const t = this;
                        if (t.mounted) return !0;
                        let s = e || t.params.el;
                        if (("string" == typeof s && (s = document.querySelector(s)), !s)) return !1;
                        (s.swiper = t), s.parentNode && s.parentNode.host && s.parentNode.host.nodeName === t.params.swiperElementNodeName.toUpperCase() && (t.isElement = !0);
                        const i = () => `.${(t.params.wrapperClass || "").trim().split(" ").join(".")}`;
                        let r = s && s.shadowRoot && s.shadowRoot.querySelector ? s.shadowRoot.querySelector(i()) : u(s, i())[0];
                        return (
                            !r &&
                                t.params.createElements &&
                                ((r = h("div", t.params.wrapperClass)),
                                s.append(r),
                                u(s, `.${t.params.slideClass}`).forEach((e) => {
                                    r.append(e);
                                })),
                            Object.assign(t, {
                                el: s,
                                wrapperEl: r,
                                slidesEl: t.isElement && !s.parentNode.host.slideSlots ? s.parentNode.host : r,
                                hostEl: t.isElement ? s.parentNode.host : s,
                                mounted: !0,
                                rtl: "rtl" === s.dir.toLowerCase() || "rtl" === f(s, "direction"),
                                rtlTranslate: "horizontal" === t.params.direction && ("rtl" === s.dir.toLowerCase() || "rtl" === f(s, "direction")),
                                wrongRTL: "-webkit-box" === f(r, "display"),
                            }),
                            !0
                        );
                    }
                    init(e) {
                        const t = this;
                        if (t.initialized) return t;
                        if (!1 === t.mount(e)) return t;
                        t.emit("beforeInit"),
                            t.params.breakpoints && t.setBreakpoint(),
                            t.addClasses(),
                            t.updateSize(),
                            t.updateSlides(),
                            t.params.watchOverflow && t.checkOverflow(),
                            t.params.grabCursor && t.enabled && t.setGrabCursor(),
                            t.params.loop && t.virtual && t.params.virtual.enabled
                                ? t.slideTo(t.params.initialSlide + t.virtual.slidesBefore, 0, t.params.runCallbacksOnInit, !1, !0)
                                : t.slideTo(t.params.initialSlide, 0, t.params.runCallbacksOnInit, !1, !0),
                            t.params.loop && t.loopCreate(),
                            t.attachEvents();
                        const s = [...t.el.querySelectorAll('[loading="lazy"]')];
                        return (
                            t.isElement && s.push(...t.hostEl.querySelectorAll('[loading="lazy"]')),
                            s.forEach((e) => {
                                e.complete
                                    ? L(t, e)
                                    : e.addEventListener("load", (e) => {
                                          L(t, e.target);
                                      });
                            }),
                            I(t),
                            (t.initialized = !0),
                            I(t),
                            t.emit("init"),
                            t.emit("afterInit"),
                            t
                        );
                    }
                    destroy(e, t) {
                        void 0 === e && (e = !0), void 0 === t && (t = !0);
                        const s = this,
                            { params: i, el: r, wrapperEl: n, slides: a } = s;
                        return (
                            void 0 === s.params ||
                                s.destroyed ||
                                (s.emit("beforeDestroy"),
                                (s.initialized = !1),
                                s.detachEvents(),
                                i.loop && s.loopDestroy(),
                                t &&
                                    (s.removeClasses(),
                                    r && "string" != typeof r && r.removeAttribute("style"),
                                    n && n.removeAttribute("style"),
                                    a &&
                                        a.length &&
                                        a.forEach((e) => {
                                            e.classList.remove(i.slideVisibleClass, i.slideFullyVisibleClass, i.slideActiveClass, i.slideNextClass, i.slidePrevClass), e.removeAttribute("style"), e.removeAttribute("data-swiper-slide-index");
                                        })),
                                s.emit("destroy"),
                                Object.keys(s.eventsListeners).forEach((e) => {
                                    s.off(e);
                                }),
                                !1 !== e &&
                                    (s.el && "string" != typeof s.el && (s.el.swiper = null),
                                    (function (e) {
                                        const t = e;
                                        Object.keys(t).forEach((e) => {
                                            try {
                                                t[e] = null;
                                            } catch (e) {}
                                            try {
                                                delete t[e];
                                            } catch (e) {}
                                        });
                                    })(s)),
                                (s.destroyed = !0)),
                            null
                        );
                    }
                    static extendDefaults(e) {
                        d(U, e);
                    }
                    static get extendedDefaults() {
                        return U;
                    }
                    static get defaults() {
                        return W;
                    }
                    static installModule(e) {
                        K.prototype.__modules__ || (K.prototype.__modules__ = []);
                        const t = K.prototype.__modules__;
                        "function" == typeof e && t.indexOf(e) < 0 && t.push(e);
                    }
                    static use(e) {
                        return Array.isArray(e) ? (e.forEach((e) => K.installModule(e)), K) : (K.installModule(e), K);
                    }
                }
                function J(e, t, s, i) {
                    return (
                        e.params.createElements &&
                            Object.keys(i).forEach((r) => {
                                if (!s[r] && !0 === s.auto) {
                                    let n = u(e.el, `.${i[r]}`)[0];
                                    n || ((n = h("div", i[r])), (n.className = i[r]), e.el.append(n)), (s[r] = n), (t[r] = n);
                                }
                            }),
                        s
                    );
                }
                function Q(e) {
                    let { swiper: t, extendParams: s, on: i, emit: r } = e;
                    function n(e) {
                        let s;
                        return e && "string" == typeof e && t.isElement && ((s = t.el.querySelector(e) || t.hostEl.querySelector(e)), s)
                            ? s
                            : (e &&
                                  ("string" == typeof e && (s = [...document.querySelectorAll(e)]),
                                  t.params.uniqueNavElements && "string" == typeof e && s && s.length > 1 && 1 === t.el.querySelectorAll(e).length ? (s = t.el.querySelector(e)) : s && 1 === s.length && (s = s[0])),
                              e && !s ? e : s);
                    }
                    function a(e, s) {
                        const i = t.params.navigation;
                        (e = b(e)).forEach((e) => {
                            e && (e.classList[s ? "add" : "remove"](...i.disabledClass.split(" ")), "BUTTON" === e.tagName && (e.disabled = s), t.params.watchOverflow && t.enabled && e.classList[t.isLocked ? "add" : "remove"](i.lockClass));
                        });
                    }
                    function l() {
                        const { nextEl: e, prevEl: s } = t.navigation;
                        if (t.params.loop) return a(s, !1), void a(e, !1);
                        a(s, t.isBeginning && !t.params.rewind), a(e, t.isEnd && !t.params.rewind);
                    }
                    function o(e) {
                        e.preventDefault(), (!t.isBeginning || t.params.loop || t.params.rewind) && (t.slidePrev(), r("navigationPrev"));
                    }
                    function d(e) {
                        e.preventDefault(), (!t.isEnd || t.params.loop || t.params.rewind) && (t.slideNext(), r("navigationNext"));
                    }
                    function c() {
                        const e = t.params.navigation;
                        if (((t.params.navigation = J(t, t.originalParams.navigation, t.params.navigation, { nextEl: "swiper-button-next", prevEl: "swiper-button-prev" })), !e.nextEl && !e.prevEl)) return;
                        let s = n(e.nextEl),
                            i = n(e.prevEl);
                        Object.assign(t.navigation, { nextEl: s, prevEl: i }), (s = b(s)), (i = b(i));
                        const r = (s, i) => {
                            s && s.addEventListener("click", "next" === i ? d : o), !t.enabled && s && s.classList.add(...e.lockClass.split(" "));
                        };
                        s.forEach((e) => r(e, "next")), i.forEach((e) => r(e, "prev"));
                    }
                    function p() {
                        let { nextEl: e, prevEl: s } = t.navigation;
                        (e = b(e)), (s = b(s));
                        const i = (e, s) => {
                            e.removeEventListener("click", "next" === s ? d : o), e.classList.remove(...t.params.navigation.disabledClass.split(" "));
                        };
                        e.forEach((e) => i(e, "next")), s.forEach((e) => i(e, "prev"));
                    }
                    s({
                        navigation: {
                            nextEl: null,
                            prevEl: null,
                            hideOnClick: !1,
                            disabledClass: "swiper-button-disabled",
                            hiddenClass: "swiper-button-hidden",
                            lockClass: "swiper-button-lock",
                            navigationDisabledClass: "swiper-navigation-disabled",
                        },
                    }),
                        (t.navigation = { nextEl: null, prevEl: null }),
                        i("init", () => {
                            !1 === t.params.navigation.enabled ? u() : (c(), l());
                        }),
                        i("toEdge fromEdge lock unlock", () => {
                            l();
                        }),
                        i("destroy", () => {
                            p();
                        }),
                        i("enable disable", () => {
                            let { nextEl: e, prevEl: s } = t.navigation;
                            (e = b(e)), (s = b(s)), t.enabled ? l() : [...e, ...s].filter((e) => !!e).forEach((e) => e.classList.add(t.params.navigation.lockClass));
                        }),
                        i("click", (e, s) => {
                            let { nextEl: i, prevEl: n } = t.navigation;
                            (i = b(i)), (n = b(n));
                            const a = s.target;
                            let l = n.includes(a) || i.includes(a);
                            if (t.isElement && !l) {
                                const e = s.path || (s.composedPath && s.composedPath());
                                e && (l = e.find((e) => i.includes(e) || n.includes(e)));
                            }
                            if (t.params.navigation.hideOnClick && !l) {
                                if (t.pagination && t.params.pagination && t.params.pagination.clickable && (t.pagination.el === a || t.pagination.el.contains(a))) return;
                                let e;
                                i.length ? (e = i[0].classList.contains(t.params.navigation.hiddenClass)) : n.length && (e = n[0].classList.contains(t.params.navigation.hiddenClass)),
                                    r(!0 === e ? "navigationShow" : "navigationHide"),
                                    [...i, ...n].filter((e) => !!e).forEach((e) => e.classList.toggle(t.params.navigation.hiddenClass));
                            }
                        });
                    const u = () => {
                        t.el.classList.add(...t.params.navigation.navigationDisabledClass.split(" ")), p();
                    };
                    Object.assign(t.navigation, {
                        enable: () => {
                            t.el.classList.remove(...t.params.navigation.navigationDisabledClass.split(" ")), c(), l();
                        },
                        disable: u,
                        update: l,
                        init: c,
                        destroy: p,
                    });
                }
                function Z(e) {
                    return (
                        void 0 === e && (e = ""),
                        `.${e
                            .trim()
                            .replace(/([\.:!+\/])/g, "\\$1")
                            .replace(/ /g, ".")}`
                    );
                }
                function ee(e) {
                    let { swiper: t, extendParams: s, on: i, emit: r } = e;
                    const n = "swiper-pagination";
                    let a;
                    s({
                        pagination: {
                            el: null,
                            bulletElement: "span",
                            clickable: !1,
                            hideOnClick: !1,
                            renderBullet: null,
                            renderProgressbar: null,
                            renderFraction: null,
                            renderCustom: null,
                            progressbarOpposite: !1,
                            type: "bullets",
                            dynamicBullets: !1,
                            dynamicMainBullets: 1,
                            formatFractionCurrent: (e) => e,
                            formatFractionTotal: (e) => e,
                            bulletClass: `${n}-bullet`,
                            bulletActiveClass: `${n}-bullet-active`,
                            modifierClass: `${n}-`,
                            currentClass: `${n}-current`,
                            totalClass: `${n}-total`,
                            hiddenClass: `${n}-hidden`,
                            progressbarFillClass: `${n}-progressbar-fill`,
                            progressbarOppositeClass: `${n}-progressbar-opposite`,
                            clickableClass: `${n}-clickable`,
                            lockClass: `${n}-lock`,
                            horizontalClass: `${n}-horizontal`,
                            verticalClass: `${n}-vertical`,
                            paginationDisabledClass: `${n}-disabled`,
                        },
                    }),
                        (t.pagination = { el: null, bullets: [] });
                    let l = 0;
                    function o() {
                        return !t.params.pagination.el || !t.pagination.el || (Array.isArray(t.pagination.el) && 0 === t.pagination.el.length);
                    }
                    function d(e, s) {
                        const { bulletActiveClass: i } = t.params.pagination;
                        e && (e = e[("prev" === s ? "previous" : "next") + "ElementSibling"]) && (e.classList.add(`${i}-${s}`), (e = e[("prev" === s ? "previous" : "next") + "ElementSibling"]) && e.classList.add(`${i}-${s}-${s}`));
                    }
                    function c(e) {
                        const s = e.target.closest(Z(t.params.pagination.bulletClass));
                        if (!s) return;
                        e.preventDefault();
                        const i = v(s) * t.params.slidesPerGroup;
                        if (t.params.loop) {
                            if (t.realIndex === i) return;
                            const e = ((r = t.realIndex), (n = i), (n %= a = t.slides.length) == 1 + (r %= a) ? "next" : n === r - 1 ? "previous" : void 0);
                            "next" === e ? t.slideNext() : "previous" === e ? t.slidePrev() : t.slideToLoop(i);
                        } else t.slideTo(i);
                        var r, n, a;
                    }
                    function p() {
                        const e = t.rtl,
                            s = t.params.pagination;
                        if (o()) return;
                        let i,
                            n,
                            c = t.pagination.el;
                        c = b(c);
                        const p = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length,
                            u = t.params.loop ? Math.ceil(p / t.params.slidesPerGroup) : t.snapGrid.length;
                        if (
                            (t.params.loop
                                ? ((n = t.previousRealIndex || 0), (i = t.params.slidesPerGroup > 1 ? Math.floor(t.realIndex / t.params.slidesPerGroup) : t.realIndex))
                                : void 0 !== t.snapIndex
                                ? ((i = t.snapIndex), (n = t.previousSnapIndex))
                                : ((n = t.previousIndex || 0), (i = t.activeIndex || 0)),
                            "bullets" === s.type && t.pagination.bullets && t.pagination.bullets.length > 0)
                        ) {
                            const r = t.pagination.bullets;
                            let o, p, u;
                            if (
                                (s.dynamicBullets &&
                                    ((a = w(r[0], t.isHorizontal() ? "width" : "height", !0)),
                                    c.forEach((e) => {
                                        e.style[t.isHorizontal() ? "width" : "height"] = a * (s.dynamicMainBullets + 4) + "px";
                                    }),
                                    s.dynamicMainBullets > 1 && void 0 !== n && ((l += i - (n || 0)), l > s.dynamicMainBullets - 1 ? (l = s.dynamicMainBullets - 1) : l < 0 && (l = 0)),
                                    (o = Math.max(i - l, 0)),
                                    (p = o + (Math.min(r.length, s.dynamicMainBullets) - 1)),
                                    (u = (p + o) / 2)),
                                r.forEach((e) => {
                                    const t = [...["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((e) => `${s.bulletActiveClass}${e}`)].map((e) => ("string" == typeof e && e.includes(" ") ? e.split(" ") : e)).flat();
                                    e.classList.remove(...t);
                                }),
                                c.length > 1)
                            )
                                r.forEach((e) => {
                                    const r = v(e);
                                    r === i ? e.classList.add(...s.bulletActiveClass.split(" ")) : t.isElement && e.setAttribute("part", "bullet"),
                                        s.dynamicBullets && (r >= o && r <= p && e.classList.add(...`${s.bulletActiveClass}-main`.split(" ")), r === o && d(e, "prev"), r === p && d(e, "next"));
                                });
                            else {
                                const e = r[i];
                                if (
                                    (e && e.classList.add(...s.bulletActiveClass.split(" ")),
                                    t.isElement &&
                                        r.forEach((e, t) => {
                                            e.setAttribute("part", t === i ? "bullet-active" : "bullet");
                                        }),
                                    s.dynamicBullets)
                                ) {
                                    const e = r[o],
                                        t = r[p];
                                    for (let e = o; e <= p; e += 1) r[e] && r[e].classList.add(...`${s.bulletActiveClass}-main`.split(" "));
                                    d(e, "prev"), d(t, "next");
                                }
                            }
                            if (s.dynamicBullets) {
                                const i = Math.min(r.length, s.dynamicMainBullets + 4),
                                    n = (a * i - a) / 2 - u * a,
                                    l = e ? "right" : "left";
                                r.forEach((e) => {
                                    e.style[t.isHorizontal() ? l : "top"] = `${n}px`;
                                });
                            }
                        }
                        c.forEach((e, n) => {
                            if (
                                ("fraction" === s.type &&
                                    (e.querySelectorAll(Z(s.currentClass)).forEach((e) => {
                                        e.textContent = s.formatFractionCurrent(i + 1);
                                    }),
                                    e.querySelectorAll(Z(s.totalClass)).forEach((e) => {
                                        e.textContent = s.formatFractionTotal(u);
                                    })),
                                "progressbar" === s.type)
                            ) {
                                let r;
                                r = s.progressbarOpposite ? (t.isHorizontal() ? "vertical" : "horizontal") : t.isHorizontal() ? "horizontal" : "vertical";
                                const n = (i + 1) / u;
                                let a = 1,
                                    l = 1;
                                "horizontal" === r ? (a = n) : (l = n),
                                    e.querySelectorAll(Z(s.progressbarFillClass)).forEach((e) => {
                                        (e.style.transform = `translate3d(0,0,0) scaleX(${a}) scaleY(${l})`), (e.style.transitionDuration = `${t.params.speed}ms`);
                                    });
                            }
                            "custom" === s.type && s.renderCustom ? ((e.innerHTML = s.renderCustom(t, i + 1, u)), 0 === n && r("paginationRender", e)) : (0 === n && r("paginationRender", e), r("paginationUpdate", e)),
                                t.params.watchOverflow && t.enabled && e.classList[t.isLocked ? "add" : "remove"](s.lockClass);
                        });
                    }
                    function u() {
                        const e = t.params.pagination;
                        if (o()) return;
                        const s = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.grid && t.params.grid.rows > 1 ? t.slides.length / Math.ceil(t.params.grid.rows) : t.slides.length;
                        let i = t.pagination.el;
                        i = b(i);
                        let n = "";
                        if ("bullets" === e.type) {
                            let i = t.params.loop ? Math.ceil(s / t.params.slidesPerGroup) : t.snapGrid.length;
                            t.params.freeMode && t.params.freeMode.enabled && i > s && (i = s);
                            for (let s = 0; s < i; s += 1) e.renderBullet ? (n += e.renderBullet.call(t, s, e.bulletClass)) : (n += `<${e.bulletElement} ${t.isElement ? 'part="bullet"' : ""} class="${e.bulletClass}"></${e.bulletElement}>`);
                        }
                        "fraction" === e.type && (n = e.renderFraction ? e.renderFraction.call(t, e.currentClass, e.totalClass) : `<span class="${e.currentClass}"></span> / <span class="${e.totalClass}"></span>`),
                            "progressbar" === e.type && (n = e.renderProgressbar ? e.renderProgressbar.call(t, e.progressbarFillClass) : `<span class="${e.progressbarFillClass}"></span>`),
                            (t.pagination.bullets = []),
                            i.forEach((s) => {
                                "custom" !== e.type && (s.innerHTML = n || ""), "bullets" === e.type && t.pagination.bullets.push(...s.querySelectorAll(Z(e.bulletClass)));
                            }),
                            "custom" !== e.type && r("paginationRender", i[0]);
                    }
                    function m() {
                        t.params.pagination = J(t, t.originalParams.pagination, t.params.pagination, { el: "swiper-pagination" });
                        const e = t.params.pagination;
                        if (!e.el) return;
                        let s;
                        "string" == typeof e.el && t.isElement && (s = t.el.querySelector(e.el)),
                            s || "string" != typeof e.el || (s = [...document.querySelectorAll(e.el)]),
                            s || (s = e.el),
                            s &&
                                0 !== s.length &&
                                (t.params.uniqueNavElements && "string" == typeof e.el && Array.isArray(s) && s.length > 1 && ((s = [...t.el.querySelectorAll(e.el)]), s.length > 1 && (s = s.filter((e) => g(e, ".swiper")[0] === t.el)[0])),
                                Array.isArray(s) && 1 === s.length && (s = s[0]),
                                Object.assign(t.pagination, { el: s }),
                                (s = b(s)),
                                s.forEach((s) => {
                                    "bullets" === e.type && e.clickable && s.classList.add(...(e.clickableClass || "").split(" ")),
                                        s.classList.add(e.modifierClass + e.type),
                                        s.classList.add(t.isHorizontal() ? e.horizontalClass : e.verticalClass),
                                        "bullets" === e.type && e.dynamicBullets && (s.classList.add(`${e.modifierClass}${e.type}-dynamic`), (l = 0), e.dynamicMainBullets < 1 && (e.dynamicMainBullets = 1)),
                                        "progressbar" === e.type && e.progressbarOpposite && s.classList.add(e.progressbarOppositeClass),
                                        e.clickable && s.addEventListener("click", c),
                                        t.enabled || s.classList.add(e.lockClass);
                                }));
                    }
                    function h() {
                        const e = t.params.pagination;
                        if (o()) return;
                        let s = t.pagination.el;
                        s &&
                            ((s = b(s)),
                            s.forEach((s) => {
                                s.classList.remove(e.hiddenClass),
                                    s.classList.remove(e.modifierClass + e.type),
                                    s.classList.remove(t.isHorizontal() ? e.horizontalClass : e.verticalClass),
                                    e.clickable && (s.classList.remove(...(e.clickableClass || "").split(" ")), s.removeEventListener("click", c));
                            })),
                            t.pagination.bullets && t.pagination.bullets.forEach((t) => t.classList.remove(...e.bulletActiveClass.split(" ")));
                    }
                    i("changeDirection", () => {
                        if (!t.pagination || !t.pagination.el) return;
                        const e = t.params.pagination;
                        let { el: s } = t.pagination;
                        (s = b(s)),
                            s.forEach((s) => {
                                s.classList.remove(e.horizontalClass, e.verticalClass), s.classList.add(t.isHorizontal() ? e.horizontalClass : e.verticalClass);
                            });
                    }),
                        i("init", () => {
                            !1 === t.params.pagination.enabled ? f() : (m(), u(), p());
                        }),
                        i("activeIndexChange", () => {
                            void 0 === t.snapIndex && p();
                        }),
                        i("snapIndexChange", () => {
                            p();
                        }),
                        i("snapGridLengthChange", () => {
                            u(), p();
                        }),
                        i("destroy", () => {
                            h();
                        }),
                        i("enable disable", () => {
                            let { el: e } = t.pagination;
                            e && ((e = b(e)), e.forEach((e) => e.classList[t.enabled ? "remove" : "add"](t.params.pagination.lockClass)));
                        }),
                        i("lock unlock", () => {
                            p();
                        }),
                        i("click", (e, s) => {
                            const i = s.target,
                                n = b(t.pagination.el);
                            if (t.params.pagination.el && t.params.pagination.hideOnClick && n && n.length > 0 && !i.classList.contains(t.params.pagination.bulletClass)) {
                                if (t.navigation && ((t.navigation.nextEl && i === t.navigation.nextEl) || (t.navigation.prevEl && i === t.navigation.prevEl))) return;
                                const e = n[0].classList.contains(t.params.pagination.hiddenClass);
                                r(!0 === e ? "paginationShow" : "paginationHide"), n.forEach((e) => e.classList.toggle(t.params.pagination.hiddenClass));
                            }
                        });
                    const f = () => {
                        t.el.classList.add(t.params.pagination.paginationDisabledClass);
                        let { el: e } = t.pagination;
                        e && ((e = b(e)), e.forEach((e) => e.classList.add(t.params.pagination.paginationDisabledClass))), h();
                    };
                    Object.assign(t.pagination, {
                        enable: () => {
                            t.el.classList.remove(t.params.pagination.paginationDisabledClass);
                            let { el: e } = t.pagination;
                            e && ((e = b(e)), e.forEach((e) => e.classList.remove(t.params.pagination.paginationDisabledClass))), m(), u(), p();
                        },
                        disable: f,
                        render: u,
                        update: p,
                        init: m,
                        destroy: h,
                    });
                }
                function te(e, t, s) {
                    function i() {
                        e.slides.forEach((e) => e.classList.remove(s));
                        const i = (e.activeIndex + t - 1) % e.slides.length;
                        e.slides[i].classList.add(s);
                    }
                    i(), e.on("slideChange", i);
                }
                Object.keys(X).forEach((e) => {
                    Object.keys(X[e]).forEach((t) => {
                        K.prototype[t] = X[e][t];
                    });
                }),
                    K.use([
                        function (e) {
                            let { swiper: t, on: s, emit: i } = e;
                            const r = n();
                            let a = null,
                                l = null;
                            const o = () => {
                                    t && !t.destroyed && t.initialized && (i("beforeResize"), i("resize"));
                                },
                                d = () => {
                                    t && !t.destroyed && t.initialized && i("orientationchange");
                                };
                            s("init", () => {
                                t.params.resizeObserver && void 0 !== r.ResizeObserver
                                    ? t &&
                                      !t.destroyed &&
                                      t.initialized &&
                                      ((a = new ResizeObserver((e) => {
                                          l = r.requestAnimationFrame(() => {
                                              const { width: s, height: i } = t;
                                              let r = s,
                                                  n = i;
                                              e.forEach((e) => {
                                                  let { contentBoxSize: s, contentRect: i, target: a } = e;
                                                  (a && a !== t.el) || ((r = i ? i.width : (s[0] || s).inlineSize), (n = i ? i.height : (s[0] || s).blockSize));
                                              }),
                                                  (r === s && n === i) || o();
                                          });
                                      })),
                                      a.observe(t.el))
                                    : (r.addEventListener("resize", o), r.addEventListener("orientationchange", d));
                            }),
                                s("destroy", () => {
                                    l && r.cancelAnimationFrame(l), a && a.unobserve && t.el && (a.unobserve(t.el), (a = null)), r.removeEventListener("resize", o), r.removeEventListener("orientationchange", d);
                                });
                        },
                        function (e) {
                            let { swiper: t, extendParams: s, on: i, emit: r } = e;
                            const a = [],
                                l = n(),
                                o = function (e, s) {
                                    void 0 === s && (s = {});
                                    const i = new (l.MutationObserver || l.WebkitMutationObserver)((e) => {
                                        if (t.__preventObserver__) return;
                                        if (1 === e.length) return void r("observerUpdate", e[0]);
                                        const s = function () {
                                            r("observerUpdate", e[0]);
                                        };
                                        l.requestAnimationFrame ? l.requestAnimationFrame(s) : l.setTimeout(s, 0);
                                    });
                                    i.observe(e, { attributes: void 0 === s.attributes || s.attributes, childList: t.isElement || (void 0 === s.childList || s).childList, characterData: void 0 === s.characterData || s.characterData }),
                                        a.push(i);
                                };
                            s({ observer: !1, observeParents: !1, observeSlideChildren: !1 }),
                                i("init", () => {
                                    if (t.params.observer) {
                                        if (t.params.observeParents) {
                                            const e = g(t.hostEl);
                                            for (let t = 0; t < e.length; t += 1) o(e[t]);
                                        }
                                        o(t.hostEl, { childList: t.params.observeSlideChildren }), o(t.wrapperEl, { attributes: !1 });
                                    }
                                }),
                                i("destroy", () => {
                                    a.forEach((e) => {
                                        e.disconnect();
                                    }),
                                        a.splice(0, a.length);
                                });
                        },
                    ]),
                    (window.onload = function () {
                        const e = document.querySelector(".hits__slider"),
                            t = document.querySelector(".promo__slider");
                        if (t) {
                            const s = new K(e, {
                                    modules: [Q],
                                    breakpoints: {
                                        1101: { slidesPerView: 3, spaceBetween: 16, slidesPerGroup: 3 },
                                        980: { slidesPerView: 2.8, spaceBetween: 10 },
                                        780: { slidesPerView: 2.1, spaceBetween: 10 },
                                        630: { slidesPerView: 1.6, spaceBetween: 10 },
                                        420: { slidesPerView: 1.2, spaceBetween: 10 },
                                    },
                                    rewind: !0,
                                    slideFullyVisibleClass: ".hits__slider-item",
                                    slideToClickedSlide: !0,
                                    navigation: { nextEl: ".hits__slider-next", prevEl: ".hits__slider-prev" },
                                }),
                                i = new K(t, {
                                    modules: [Q],
                                    setWrapperSize: !0,
                                    breakpoints: { 1101: { slidesPerView: 3, spaceBetween: 16 }, 640: { slidesPerView: 2, spaceBetween: 5 }, 375: { slidesPerView: 1 } },
                                    rewind: !0,
                                    slidesPerGroup: 1,
                                    navigation: { nextEl: ".promo__slider-next", prevEl: ".promo__slider-prev" },
                                });
                            te(s, 2, "second-slide"), te(i, 2, "promo__slider-seconditem"), te(i, 3, "promo__slider-thirditem");
                        }
                        if (window.innerWidth <= 641) {
                            const e = document.querySelector(".house__slider");
                            e && new K(e, { modules: [Q, ee], slidesPerView: 1, setWrapperSize: !0, rewind: !0, slidesPerGroup: 1, spaceBetween: 15, pagination: { el: ".swiper-pagination", clickable: !0 } });
                        }
                    });
            },
        },
        t = {};
    !(function s(i) {
        var r = t[i];
        if (void 0 !== r) return r.exports;
        var n = (t[i] = { exports: {} });
        return e[i](n, n.exports, s), n.exports;
    })(8221);
    const s = document.querySelectorAll(".tablink");
    s.forEach((e) => {
        e.addEventListener("click", function (e) {
            !(function (e, t) {
                let i, r;
                for (r = document.getElementsByClassName("tabcontent"), i = 0; i < r.length; i++) r[i].style.display = "none";
                for (i = 0; i < s.length; i++) s[i].className = s[i].className.replace(" active", "");
                (document.getElementById(t).style.display = "block"), (e.currentTarget.className += " active");
            })(e, this.getAttribute("data-tabid"));
        });
    });
    let i = document.querySelectorAll(".thumb img"),
        r = document.querySelector(".house__images-main img"),
        n = document.querySelector(".thumb.overlay");
    i.length <= 3 && n.classList.remove("overlay"),
        i.forEach((e) => {
            e.addEventListener("click", function () {
                r.src = this.src;
            });
        }),
        (function () {
            let e = document.querySelector(".popup.order"),
                t = document.querySelector(".order-popup__close"),
                s = document.querySelector("#product-submit"),
                i = document.querySelector(".order-popup__overlay");
            s.addEventListener("click", function (t) {
                t.stopPropagation(), e.classList.add("show"), i.classList.add("show"), document.body.classList.add("no-scroll");
                handleSubmitButtonClick();
            }),
                t.addEventListener("click", function (t) {
                    e.classList.remove("show"), i.classList.remove("show"), document.body.classList.remove("no-scroll"), t.stopPropagation();
                }),
                document.addEventListener("click", function (t) {
                    e.contains(t.target) || s.contains(t.target) || (e.classList.remove("show"), i.classList.remove("show"), document.body.classList.remove("no-scroll"));
                }),
                document.addEventListener("keydown", function (t) {
                    "Escape" === t.key && (e.classList.remove("show"), i.classList.remove("show"), document.body.classList.remove("no-scroll"));
                }),
                e.addEventListener("click", function (e) {
                    e.stopPropagation();
                });
                function handleSubmitButtonClick() {
                    const materialSelect = document.getElementById('material-select');
                    const surfaceSelect = document.getElementById('surface-select').value;
                    const price = document.querySelector('.price__sum').textContent;
                    const house = document.querySelector('.house__name').getAttribute('data-house-name')

                    const materialSlug = materialSelect.value;
                    const materialName = materialSelect.options[materialSelect.selectedIndex].text;

                    // Vérifier si les champs sont sélectionnés
                    const selectedMaterialText = materialSlug ? materialName : "Не выбрано"; // Afficher "Не выбрано" si aucun matériau n'est sélectionné
                    const selectedSurfaceText = surfaceSelect ? surfaceSelect : "Не выбрано"; // Afficher "Не выбрано" si aucune surface n'est sélectionnée

                                
                    // Update Popup content
                    // // document.getElementById('popup-material').textContent = materialSlug;
                    // document.getElementById('popup-material').textContent = selectedMaterialText;
                    // document.getElementById('popup-surface').textContent = selectedSurfaceText; 
                    // document.getElementById('popup-price').textContent = price; 
                    const materialSpan = document.getElementById('popup-material');
                    const surfaceSpan = document.getElementById('popup-surface');
                    const priceHouse = document.getElementById('popup-price')

                        // Get variables from vacancy page
                    const materialNameInput = document.getElementById('material-name');
                    const surfaceHouseInput = document.getElementById('surface-house');
                    const priceHouseInput= document.getElementById('price-house');
                    const NameHouseInput= document.getElementById('name-house');

                    materialSpan.textContent = selectedMaterialText; 
                    surfaceSpan.textContent = selectedSurfaceText; 
                    priceHouse.textContent = price;
                    
                    materialNameInput.value = selectedMaterialText;
                    surfaceHouseInput.value = selectedSurfaceText;
                    priceHouseInput.value = price;
                    NameHouseInput.value = house;

                    // Appliquer les classes de style en fonction des sélections
                    materialSpan.className = materialSlug ? 'k_order-success' : 'k_order-error'; 
                    surfaceSpan.className = surfaceSelect ? 'k_order-success' : 'k_order-error';

                }
        })();
})();
