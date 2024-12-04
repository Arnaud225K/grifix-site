(() => {
    "use strict";
    var t, e;
    function r(t) {
        return "object" == typeof t && "function" == typeof t.to;
    }
    function n(t) {
        t.parentElement.removeChild(t);
    }
    function i(t) {
        return null != t;
    }
    function o(t) {
        t.preventDefault();
    }
    function s(t) {
        return "number" == typeof t && !isNaN(t) && isFinite(t);
    }
    function a(t, e, r) {
        r > 0 &&
            (f(t, e),
            setTimeout(function () {
                d(t, e);
            }, r));
    }
    function l(t) {
        return Math.max(Math.min(t, 100), 0);
    }
    function u(t) {
        return Array.isArray(t) ? t : [t];
    }
    function c(t) {
        var e = (t = String(t)).split(".");
        return e.length > 1 ? e[1].length : 0;
    }
    function f(t, e) {
        t.classList && !/\s/.test(e) ? t.classList.add(e) : (t.className += " " + e);
    }
    function d(t, e) {
        t.classList && !/\s/.test(e) ? t.classList.remove(e) : (t.className = t.className.replace(new RegExp("(^|\\b)" + e.split(" ").join("|") + "(\\b|$)", "gi"), " "));
    }
    function p(t) {
        var e = void 0 !== window.pageXOffset,
            r = "CSS1Compat" === (t.compatMode || "");
        return { x: e ? window.pageXOffset : r ? t.documentElement.scrollLeft : t.body.scrollLeft, y: e ? window.pageYOffset : r ? t.documentElement.scrollTop : t.body.scrollTop };
    }
    function h(t, e) {
        return 100 / (e - t);
    }
    function m(t, e, r) {
        return (100 * e) / (t[r + 1] - t[r]);
    }
    function g(t, e) {
        for (var r = 1; t >= e[r]; ) r += 1;
        return r;
    }
    !(function (t) {
        (t.Range = "range"), (t.Steps = "steps"), (t.Positions = "positions"), (t.Count = "count"), (t.Values = "values");
    })(t || (t = {})),
        (function (t) {
            (t[(t.None = -1)] = "None"), (t[(t.NoValue = 0)] = "NoValue"), (t[(t.LargeValue = 1)] = "LargeValue"), (t[(t.SmallValue = 2)] = "SmallValue");
        })(e || (e = {}));
    var v = (function () {
            function t(t, e, r) {
                var n;
                (this.xPct = []), (this.xVal = []), (this.xSteps = []), (this.xNumSteps = []), (this.xHighestCompleteStep = []), (this.xSteps = [r || !1]), (this.xNumSteps = [!1]), (this.snap = e);
                var i = [];
                for (
                    Object.keys(t).forEach(function (e) {
                        i.push([u(t[e]), e]);
                    }),
                        i.sort(function (t, e) {
                            return t[0][0] - e[0][0];
                        }),
                        n = 0;
                    n < i.length;
                    n++
                )
                    this.handleEntryPoint(i[n][1], i[n][0]);
                for (this.xNumSteps = this.xSteps.slice(0), n = 0; n < this.xNumSteps.length; n++) this.handleStepPoint(n, this.xNumSteps[n]);
            }
            return (
                (t.prototype.getDistance = function (t) {
                    for (var e = [], r = 0; r < this.xNumSteps.length - 1; r++) e[r] = m(this.xVal, t, r);
                    return e;
                }),
                (t.prototype.getAbsoluteDistance = function (t, e, r) {
                    var n,
                        i = 0;
                    if (t < this.xPct[this.xPct.length - 1]) for (; t > this.xPct[i + 1]; ) i++;
                    else t === this.xPct[this.xPct.length - 1] && (i = this.xPct.length - 2);
                    r || t !== this.xPct[i + 1] || i++, null === e && (e = []);
                    var o = 1,
                        s = e[i],
                        a = 0,
                        l = 0,
                        u = 0,
                        c = 0;
                    for (n = r ? (t - this.xPct[i]) / (this.xPct[i + 1] - this.xPct[i]) : (this.xPct[i + 1] - t) / (this.xPct[i + 1] - this.xPct[i]); s > 0; )
                        (a = this.xPct[i + 1 + c] - this.xPct[i + c]),
                            e[i + c] * o + 100 - 100 * n > 100 ? ((l = a * n), (o = (s - 100 * n) / e[i + c]), (n = 1)) : ((l = ((e[i + c] * a) / 100) * o), (o = 0)),
                            r ? ((u -= l), this.xPct.length + c >= 1 && c--) : ((u += l), this.xPct.length - c >= 1 && c++),
                            (s = e[i + c] * o);
                    return t + u;
                }),
                (t.prototype.toStepping = function (t) {
                    return (function (t, e, r) {
                        if (r >= t.slice(-1)[0]) return 100;
                        var n = g(r, t),
                            i = t[n - 1],
                            o = t[n],
                            s = e[n - 1],
                            a = e[n];
                        return (
                            s +
                            (function (t, e) {
                                return m(t, t[0] < 0 ? e + Math.abs(t[0]) : e - t[0], 0);
                            })([i, o], r) /
                                h(s, a)
                        );
                    })(this.xVal, this.xPct, t);
                }),
                (t.prototype.fromStepping = function (t) {
                    return (function (t, e, r) {
                        if (r >= 100) return t.slice(-1)[0];
                        var n = g(r, e),
                            i = t[n - 1],
                            o = t[n],
                            s = e[n - 1];
                        return (function (t, e) {
                            return (e * (t[1] - t[0])) / 100 + t[0];
                        })([i, o], (r - s) * h(s, e[n]));
                    })(this.xVal, this.xPct, t);
                }),
                (t.prototype.getStep = function (t) {
                    return (function (t, e, r, n) {
                        if (100 === n) return n;
                        var i = g(n, t),
                            o = t[i - 1],
                            s = t[i];
                        return r
                            ? n - o > (s - o) / 2
                                ? s
                                : o
                            : e[i - 1]
                            ? t[i - 1] +
                              (function (t, e) {
                                  return Math.round(t / e) * e;
                              })(n - t[i - 1], e[i - 1])
                            : n;
                    })(this.xPct, this.xSteps, this.snap, t);
                }),
                (t.prototype.getDefaultStep = function (t, e, r) {
                    var n = g(t, this.xPct);
                    return (100 === t || (e && t === this.xPct[n - 1])) && (n = Math.max(n - 1, 1)), (this.xVal[n] - this.xVal[n - 1]) / r;
                }),
                (t.prototype.getNearbySteps = function (t) {
                    var e = g(t, this.xPct);
                    return {
                        stepBefore: { startValue: this.xVal[e - 2], step: this.xNumSteps[e - 2], highestStep: this.xHighestCompleteStep[e - 2] },
                        thisStep: { startValue: this.xVal[e - 1], step: this.xNumSteps[e - 1], highestStep: this.xHighestCompleteStep[e - 1] },
                        stepAfter: { startValue: this.xVal[e], step: this.xNumSteps[e], highestStep: this.xHighestCompleteStep[e] },
                    };
                }),
                (t.prototype.countStepDecimals = function () {
                    var t = this.xNumSteps.map(c);
                    return Math.max.apply(null, t);
                }),
                (t.prototype.hasNoSize = function () {
                    return this.xVal[0] === this.xVal[this.xVal.length - 1];
                }),
                (t.prototype.convert = function (t) {
                    return this.getStep(this.toStepping(t));
                }),
                (t.prototype.handleEntryPoint = function (t, e) {
                    var r;
                    if (!s((r = "min" === t ? 0 : "max" === t ? 100 : parseFloat(t))) || !s(e[0])) throw new Error("noUiSlider: 'range' value isn't numeric.");
                    this.xPct.push(r), this.xVal.push(e[0]);
                    var n = Number(e[1]);
                    r ? this.xSteps.push(!isNaN(n) && n) : isNaN(n) || (this.xSteps[0] = n), this.xHighestCompleteStep.push(0);
                }),
                (t.prototype.handleStepPoint = function (t, e) {
                    if (e)
                        if (this.xVal[t] !== this.xVal[t + 1]) {
                            this.xSteps[t] = m([this.xVal[t], this.xVal[t + 1]], e, 0) / h(this.xPct[t], this.xPct[t + 1]);
                            var r = (this.xVal[t + 1] - this.xVal[t]) / this.xNumSteps[t],
                                n = Math.ceil(Number(r.toFixed(3)) - 1),
                                i = this.xVal[t] + this.xNumSteps[t] * n;
                            this.xHighestCompleteStep[t] = i;
                        } else this.xSteps[t] = this.xHighestCompleteStep[t] = this.xVal[t];
                }),
                t
            );
        })(),
        b = {
            to: function (t) {
                return void 0 === t ? "" : t.toFixed(2);
            },
            from: Number,
        },
        S = {
            target: "target",
            base: "base",
            origin: "origin",
            handle: "handle",
            handleLower: "handle-lower",
            handleUpper: "handle-upper",
            touchArea: "touch-area",
            horizontal: "horizontal",
            vertical: "vertical",
            background: "background",
            connect: "connect",
            connects: "connects",
            ltr: "ltr",
            rtl: "rtl",
            textDirectionLtr: "txt-dir-ltr",
            textDirectionRtl: "txt-dir-rtl",
            draggable: "draggable",
            drag: "state-drag",
            tap: "state-tap",
            active: "active",
            tooltip: "tooltip",
            pips: "pips",
            pipsHorizontal: "pips-horizontal",
            pipsVertical: "pips-vertical",
            marker: "marker",
            markerHorizontal: "marker-horizontal",
            markerVertical: "marker-vertical",
            markerNormal: "marker-normal",
            markerLarge: "marker-large",
            markerSub: "marker-sub",
            value: "value",
            valueHorizontal: "value-horizontal",
            valueVertical: "value-vertical",
            valueNormal: "value-normal",
            valueLarge: "value-large",
            valueSub: "value-sub",
        },
        x = ".__tooltips",
        y = ".__aria";
    function w(t, e) {
        if (!s(e)) throw new Error("noUiSlider: 'step' is not numeric.");
        t.singleStep = e;
    }
    function E(t, e) {
        if (!s(e)) throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.");
        t.keyboardPageMultiplier = e;
    }
    function C(t, e) {
        if (!s(e)) throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");
        t.keyboardMultiplier = e;
    }
    function N(t, e) {
        if (!s(e)) throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");
        t.keyboardDefaultStep = e;
    }
    function k(t, e) {
        if ("object" != typeof e || Array.isArray(e)) throw new Error("noUiSlider: 'range' is not an object.");
        if (void 0 === e.min || void 0 === e.max) throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
        t.spectrum = new v(e, t.snap || !1, t.singleStep);
    }
    function P(t, e) {
        if (((e = u(e)), !Array.isArray(e) || !e.length)) throw new Error("noUiSlider: 'start' option is incorrect.");
        (t.handles = e.length), (t.start = e);
    }
    function A(t, e) {
        if ("boolean" != typeof e) throw new Error("noUiSlider: 'snap' option must be a boolean.");
        t.snap = e;
    }
    function V(t, e) {
        if ("boolean" != typeof e) throw new Error("noUiSlider: 'animate' option must be a boolean.");
        t.animate = e;
    }
    function L(t, e) {
        if ("number" != typeof e) throw new Error("noUiSlider: 'animationDuration' option must be a number.");
        t.animationDuration = e;
    }
    function U(t, e) {
        var r,
            n = [!1];
        if (("lower" === e ? (e = [!0, !1]) : "upper" === e && (e = [!1, !0]), !0 === e || !1 === e)) {
            for (r = 1; r < t.handles; r++) n.push(e);
            n.push(!1);
        } else {
            if (!Array.isArray(e) || !e.length || e.length !== t.handles + 1) throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
            n = e;
        }
        t.connect = n;
    }
    function M(t, e) {
        switch (e) {
            case "horizontal":
                t.ort = 0;
                break;
            case "vertical":
                t.ort = 1;
                break;
            default:
                throw new Error("noUiSlider: 'orientation' option is invalid.");
        }
    }
    function D(t, e) {
        if (!s(e)) throw new Error("noUiSlider: 'margin' option must be numeric.");
        0 !== e && (t.margin = t.spectrum.getDistance(e));
    }
    function O(t, e) {
        if (!s(e)) throw new Error("noUiSlider: 'limit' option must be numeric.");
        if (((t.limit = t.spectrum.getDistance(e)), !t.limit || t.handles < 2)) throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.");
    }
    function _(t, e) {
        var r;
        if (!s(e) && !Array.isArray(e)) throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
        if (Array.isArray(e) && 2 !== e.length && !s(e[0]) && !s(e[1])) throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
        if (0 !== e) {
            for (Array.isArray(e) || (e = [e, e]), t.padding = [t.spectrum.getDistance(e[0]), t.spectrum.getDistance(e[1])], r = 0; r < t.spectrum.xNumSteps.length - 1; r++)
                if (t.padding[0][r] < 0 || t.padding[1][r] < 0) throw new Error("noUiSlider: 'padding' option must be a positive number(s).");
            var n = e[0] + e[1],
                i = t.spectrum.xVal[0];
            if (n / (t.spectrum.xVal[t.spectrum.xVal.length - 1] - i) > 1) throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.");
        }
    }
    function q(t, e) {
        switch (e) {
            case "ltr":
                t.dir = 0;
                break;
            case "rtl":
                t.dir = 1;
                break;
            default:
                throw new Error("noUiSlider: 'direction' option was not recognized.");
        }
    }
    function z(t, e) {
        if ("string" != typeof e) throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
        var r = e.indexOf("tap") >= 0,
            n = e.indexOf("drag") >= 0,
            i = e.indexOf("fixed") >= 0,
            o = e.indexOf("snap") >= 0,
            s = e.indexOf("hover") >= 0,
            a = e.indexOf("unconstrained") >= 0,
            l = e.indexOf("invert-connects") >= 0,
            u = e.indexOf("drag-all") >= 0,
            c = e.indexOf("smooth-steps") >= 0;
        if (i) {
            if (2 !== t.handles) throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");
            D(t, t.start[1] - t.start[0]);
        }
        if (l && 2 !== t.handles) throw new Error("noUiSlider: 'invert-connects' behaviour must be used with 2 handles");
        if (a && (t.margin || t.limit)) throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");
        t.events = { tap: r || o, drag: n, dragAll: u, smoothSteps: c, fixed: i, snap: o, hover: s, unconstrained: a, invertConnects: l };
    }
    function j(t, e) {
        if (!1 !== e)
            if (!0 === e || r(e)) {
                t.tooltips = [];
                for (var n = 0; n < t.handles; n++) t.tooltips.push(e);
            } else {
                if ((e = u(e)).length !== t.handles) throw new Error("noUiSlider: must pass a formatter for all handles.");
                e.forEach(function (t) {
                    if ("boolean" != typeof t && !r(t)) throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
                }),
                    (t.tooltips = e);
            }
    }
    function H(t, e) {
        if (e.length !== t.handles) throw new Error("noUiSlider: must pass a attributes for all handles.");
        t.handleAttributes = e;
    }
    function F(t, e) {
        if (!r(e)) throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");
        t.ariaFormat = e;
    }
    function R(t, e) {
        if (
            !(function (t) {
                return r(t) && "function" == typeof t.from;
            })(e)
        )
            throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
        t.format = e;
    }
    function T(t, e) {
        if ("boolean" != typeof e) throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");
        t.keyboardSupport = e;
    }
    function B(t, e) {
        t.documentElement = e;
    }
    function I(t, e) {
        if ("string" != typeof e && !1 !== e) throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
        t.cssPrefix = e;
    }
    function X(t, e) {
        if ("object" != typeof e) throw new Error("noUiSlider: 'cssClasses' must be an object.");
        "string" == typeof t.cssPrefix
            ? ((t.cssClasses = {}),
              Object.keys(e).forEach(function (r) {
                  t.cssClasses[r] = t.cssPrefix + e[r];
              }))
            : (t.cssClasses = e);
    }
    function Y(t) {
        var e = { margin: null, limit: null, padding: null, animate: !0, animationDuration: 300, ariaFormat: b, format: b },
            r = {
                step: { r: !1, t: w },
                keyboardPageMultiplier: { r: !1, t: E },
                keyboardMultiplier: { r: !1, t: C },
                keyboardDefaultStep: { r: !1, t: N },
                start: { r: !0, t: P },
                connect: { r: !0, t: U },
                direction: { r: !0, t: q },
                snap: { r: !1, t: A },
                animate: { r: !1, t: V },
                animationDuration: { r: !1, t: L },
                range: { r: !0, t: k },
                orientation: { r: !1, t: M },
                margin: { r: !1, t: D },
                limit: { r: !1, t: O },
                padding: { r: !1, t: _ },
                behaviour: { r: !0, t: z },
                ariaFormat: { r: !1, t: F },
                format: { r: !1, t: R },
                tooltips: { r: !1, t: j },
                keyboardSupport: { r: !0, t: T },
                documentElement: { r: !1, t: B },
                cssPrefix: { r: !0, t: I },
                cssClasses: { r: !0, t: X },
                handleAttributes: { r: !1, t: H },
            },
            n = { connect: !1, direction: "ltr", behaviour: "tap", orientation: "horizontal", keyboardSupport: !0, cssPrefix: "noUi-", cssClasses: S, keyboardPageMultiplier: 5, keyboardMultiplier: 1, keyboardDefaultStep: 10 };
        t.format && !t.ariaFormat && (t.ariaFormat = t.format),
            Object.keys(r).forEach(function (o) {
                if (i(t[o]) || void 0 !== n[o]) r[o].t(e, i(t[o]) ? t[o] : n[o]);
                else if (r[o].r) throw new Error("noUiSlider: '" + o + "' is required.");
            }),
            (e.pips = t.pips);
        var o = document.createElement("div"),
            s = void 0 !== o.style.msTransform,
            a = void 0 !== o.style.transform;
        return (
            (e.transformRule = a ? "transform" : s ? "msTransform" : "webkitTransform"),
            (e.style = [
                ["left", "top"],
                ["right", "bottom"],
            ][e.dir][e.ort]),
            e
        );
    }
    function W(r, s, c) {
        var h,
            m,
            g,
            v,
            b,
            S,
            w,
            E = window.navigator.pointerEnabled
                ? { start: "pointerdown", move: "pointermove", end: "pointerup" }
                : window.navigator.msPointerEnabled
                ? { start: "MSPointerDown", move: "MSPointerMove", end: "MSPointerUp" }
                : { start: "mousedown touchstart", move: "mousemove touchmove", end: "mouseup touchend" },
            C =
                window.CSS &&
                CSS.supports &&
                CSS.supports("touch-action", "none") &&
                (function () {
                    var t = !1;
                    try {
                        var e = Object.defineProperty({}, "passive", {
                            get: function () {
                                t = !0;
                            },
                        });
                        window.addEventListener("test", null, e);
                    } catch (t) {}
                    return t;
                })(),
            N = r,
            k = s.spectrum,
            P = [],
            A = [],
            V = [],
            L = 0,
            M = {},
            D = !1,
            O = r.ownerDocument,
            _ = s.documentElement || O.documentElement,
            q = O.body,
            z = "rtl" === O.dir || 1 === s.ort ? 0 : 100;
        function j(t, e) {
            var r = O.createElement("div");
            return e && f(r, e), t.appendChild(r), r;
        }
        function H(t, e) {
            var r = j(t, s.cssClasses.origin),
                n = j(r, s.cssClasses.handle);
            if (
                (j(n, s.cssClasses.touchArea),
                n.setAttribute("data-handle", String(e)),
                s.keyboardSupport &&
                    (n.setAttribute("tabindex", "0"),
                    n.addEventListener("keydown", function (t) {
                        return (function (t, e) {
                            if (T() || B(e)) return !1;
                            var r = ["Left", "Right"],
                                n = ["Down", "Up"],
                                i = ["PageDown", "PageUp"],
                                o = ["Home", "End"];
                            s.dir && !s.ort ? r.reverse() : s.ort && !s.dir && (n.reverse(), i.reverse());
                            var a,
                                l = t.key.replace("Arrow", ""),
                                u = l === i[0],
                                c = l === i[1],
                                f = l === n[0] || l === r[0] || u,
                                d = l === n[1] || l === r[1] || c,
                                p = l === o[1];
                            if (!(f || d || l === o[0] || p)) return !0;
                            if ((t.preventDefault(), d || f)) {
                                var h = f ? 0 : 1,
                                    m = St(e)[h];
                                if (null === m) return !1;
                                !1 === m && (m = k.getDefaultStep(A[e], f, s.keyboardDefaultStep)), (m *= c || u ? s.keyboardPageMultiplier : s.keyboardMultiplier), (m = Math.max(m, 1e-7)), (m *= f ? -1 : 1), (a = P[e] + m);
                            } else a = p ? s.spectrum.xVal[s.spectrum.xVal.length - 1] : s.spectrum.xVal[0];
                            return ht(e, k.toStepping(a), !0, !0), lt("slide", e), lt("update", e), lt("change", e), lt("set", e), !1;
                        })(t, e);
                    })),
                void 0 !== s.handleAttributes)
            ) {
                var i = s.handleAttributes[e];
                Object.keys(i).forEach(function (t) {
                    n.setAttribute(t, i[t]);
                });
            }
            return n.setAttribute("role", "slider"), n.setAttribute("aria-orientation", s.ort ? "vertical" : "horizontal"), 0 === e ? f(n, s.cssClasses.handleLower) : e === s.handles - 1 && f(n, s.cssClasses.handleUpper), (r.handle = n), r;
        }
        function F(t, e) {
            return !!e && j(t, s.cssClasses.connect);
        }
        function R(t, e) {
            return !(!s.tooltips || !s.tooltips[e]) && j(t.firstChild, s.cssClasses.tooltip);
        }
        function T() {
            return N.hasAttribute("disabled");
        }
        function B(t) {
            return g[t].hasAttribute("disabled");
        }
        function I() {
            S &&
                (at("update" + x),
                S.forEach(function (t) {
                    t && n(t);
                }),
                (S = null));
        }
        function X() {
            I(),
                (S = g.map(R)),
                st("update" + x, function (t, e, r) {
                    if (S && s.tooltips && !1 !== S[e]) {
                        var n = t[e];
                        !0 !== s.tooltips[e] && (n = s.tooltips[e].to(r[e])), (S[e].innerHTML = n);
                    }
                });
        }
        function W(t, e) {
            return t.map(function (t) {
                return k.fromStepping(e ? k.getStep(t) : t);
            });
        }
        function $() {
            b && (n(b), (b = null));
        }
        function G(r) {
            $();
            var n = (function (r) {
                    var n,
                        i = (function (e) {
                            if (e.mode === t.Range || e.mode === t.Steps) return k.xVal;
                            if (e.mode === t.Count) {
                                if (e.values < 2) throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");
                                for (var r = e.values - 1, n = 100 / r, i = []; r--; ) i[r] = r * n;
                                return i.push(100), W(i, e.stepped);
                            }
                            return e.mode === t.Positions
                                ? W(e.values, e.stepped)
                                : e.mode === t.Values
                                ? e.stepped
                                    ? e.values.map(function (t) {
                                          return k.fromStepping(k.getStep(k.toStepping(t)));
                                      })
                                    : e.values
                                : [];
                        })(r),
                        o = {},
                        s = k.xVal[0],
                        a = k.xVal[k.xVal.length - 1],
                        l = !1,
                        u = !1,
                        c = 0;
                    return (
                        (n = i.slice().sort(function (t, e) {
                            return t - e;
                        })),
                        (i = n.filter(function (t) {
                            return !this[t] && (this[t] = !0);
                        }, {}))[0] !== s && (i.unshift(s), (l = !0)),
                        i[i.length - 1] !== a && (i.push(a), (u = !0)),
                        i.forEach(function (n, s) {
                            var a,
                                f,
                                d,
                                p,
                                h,
                                m,
                                g,
                                v,
                                b,
                                S,
                                x = n,
                                y = i[s + 1],
                                w = r.mode === t.Steps;
                            for (w && (a = k.xNumSteps[s]), a || (a = y - x), void 0 === y && (y = x), a = Math.max(a, 1e-7), f = x; f <= y; f = Number((f + a).toFixed(7))) {
                                for (v = (h = (p = k.toStepping(f)) - c) / (r.density || 1), S = h / (b = Math.round(v)), d = 1; d <= b; d += 1) o[(m = c + d * S).toFixed(5)] = [k.fromStepping(m), 0];
                                (g = i.indexOf(f) > -1 ? e.LargeValue : w ? e.SmallValue : e.NoValue), !s && l && f !== y && (g = 0), (f === y && u) || (o[p.toFixed(5)] = [f, g]), (c = p);
                            }
                        }),
                        o
                    );
                })(r),
                i = r.filter,
                o = r.format || {
                    to: function (t) {
                        return String(Math.round(t));
                    },
                };
            return (b = N.appendChild(
                (function (t, r, n) {
                    var i,
                        o,
                        a = O.createElement("div"),
                        l = (((i = {})[e.None] = ""), (i[e.NoValue] = s.cssClasses.valueNormal), (i[e.LargeValue] = s.cssClasses.valueLarge), (i[e.SmallValue] = s.cssClasses.valueSub), i),
                        u = (((o = {})[e.None] = ""), (o[e.NoValue] = s.cssClasses.markerNormal), (o[e.LargeValue] = s.cssClasses.markerLarge), (o[e.SmallValue] = s.cssClasses.markerSub), o),
                        c = [s.cssClasses.valueHorizontal, s.cssClasses.valueVertical],
                        d = [s.cssClasses.markerHorizontal, s.cssClasses.markerVertical];
                    function p(t, e) {
                        var r = e === s.cssClasses.value,
                            n = r ? l : u;
                        return e + " " + (r ? c : d)[s.ort] + " " + n[t];
                    }
                    return (
                        f(a, s.cssClasses.pips),
                        f(a, 0 === s.ort ? s.cssClasses.pipsHorizontal : s.cssClasses.pipsVertical),
                        Object.keys(t).forEach(function (i) {
                            !(function (t, i, o) {
                                if ((o = r ? r(i, o) : o) !== e.None) {
                                    var l = j(a, !1);
                                    (l.className = p(o, s.cssClasses.marker)),
                                        (l.style[s.style] = t + "%"),
                                        o > e.NoValue && (((l = j(a, !1)).className = p(o, s.cssClasses.value)), l.setAttribute("data-value", String(i)), (l.style[s.style] = t + "%"), (l.innerHTML = String(n.to(i))));
                                }
                            })(i, t[i][0], t[i][1]);
                        }),
                        a
                    );
                })(n, i, o)
            ));
        }
        function J() {
            var t = h.getBoundingClientRect(),
                e = "offset" + ["Width", "Height"][s.ort];
            return 0 === s.ort ? t.width || h[e] : t.height || h[e];
        }
        function K(t, e, r, n) {
            var i = function (i) {
                    var o,
                        a,
                        l = (function (t, e, r) {
                            var n = 0 === t.type.indexOf("touch"),
                                i = 0 === t.type.indexOf("mouse"),
                                o = 0 === t.type.indexOf("pointer"),
                                s = 0,
                                a = 0;
                            if ((0 === t.type.indexOf("MSPointer") && (o = !0), "mousedown" === t.type && !t.buttons && !t.touches)) return !1;
                            if (n) {
                                var l = function (e) {
                                    var n = e.target;
                                    return n === r || r.contains(n) || (t.composed && t.composedPath().shift() === r);
                                };
                                if ("touchstart" === t.type) {
                                    var u = Array.prototype.filter.call(t.touches, l);
                                    if (u.length > 1) return !1;
                                    (s = u[0].pageX), (a = u[0].pageY);
                                } else {
                                    var c = Array.prototype.find.call(t.changedTouches, l);
                                    if (!c) return !1;
                                    (s = c.pageX), (a = c.pageY);
                                }
                            }
                            return (e = e || p(O)), (i || o) && ((s = t.clientX + e.x), (a = t.clientY + e.y)), (t.pageOffset = e), (t.points = [s, a]), (t.cursor = i || o), t;
                        })(i, n.pageOffset, n.target || e);
                    return (
                        !!l &&
                        !(T() && !n.doNotReject) &&
                        ((o = N),
                        (a = s.cssClasses.tap),
                        !((o.classList ? o.classList.contains(a) : new RegExp("\\b" + a + "\\b").test(o.className)) && !n.doNotReject) &&
                            !(t === E.start && void 0 !== l.buttons && l.buttons > 1) &&
                            (!n.hover || !l.buttons) &&
                            (C || l.preventDefault(), (l.calcPoint = l.points[s.ort]), void r(l, n)))
                    );
                },
                o = [];
            return (
                t.split(" ").forEach(function (t) {
                    e.addEventListener(t, i, !!C && { passive: !0 }), o.push([t, i]);
                }),
                o
            );
        }
        function Q(t) {
            var e,
                r,
                n,
                i,
                o,
                a,
                u =
                    (100 *
                        (t -
                            ((e = h),
                            (r = s.ort),
                            (n = e.getBoundingClientRect()),
                            (o = (i = e.ownerDocument).documentElement),
                            (a = p(i)),
                            /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) && (a.x = 0),
                            r ? n.top + a.y - o.clientTop : n.left + a.x - o.clientLeft))) /
                    J();
            return (u = l(u)), s.dir ? 100 - u : u;
        }
        function Z(t, e) {
            "mouseout" === t.type && "HTML" === t.target.nodeName && null === t.relatedTarget && et(t, e);
        }
        function tt(t, e) {
            if (-1 === navigator.appVersion.indexOf("MSIE 9") && 0 === t.buttons && 0 !== e.buttonsProperty) return et(t, e);
            var r = (s.dir ? -1 : 1) * (t.calcPoint - e.startCalcPoint);
            ft(r > 0, (100 * r) / e.baseSize, e.locations, e.handleNumbers, e.connect);
        }
        function et(t, e) {
            e.handle && (d(e.handle, s.cssClasses.active), (L -= 1)),
                e.listeners.forEach(function (t) {
                    _.removeEventListener(t[0], t[1]);
                }),
                0 === L && (d(N, s.cssClasses.drag), pt(), t.cursor && ((q.style.cursor = ""), q.removeEventListener("selectstart", o))),
                s.events.smoothSteps &&
                    (e.handleNumbers.forEach(function (t) {
                        ht(t, A[t], !0, !0, !1, !1);
                    }),
                    e.handleNumbers.forEach(function (t) {
                        lt("update", t);
                    })),
                e.handleNumbers.forEach(function (t) {
                    lt("change", t), lt("set", t), lt("end", t);
                });
        }
        function rt(t, e) {
            if (!e.handleNumbers.some(B)) {
                var r;
                1 === e.handleNumbers.length && ((r = g[e.handleNumbers[0]].children[0]), (L += 1), f(r, s.cssClasses.active)), t.stopPropagation();
                var n = [],
                    i = K(E.move, _, tt, {
                        target: t.target,
                        handle: r,
                        connect: e.connect,
                        listeners: n,
                        startCalcPoint: t.calcPoint,
                        baseSize: J(),
                        pageOffset: t.pageOffset,
                        handleNumbers: e.handleNumbers,
                        buttonsProperty: t.buttons,
                        locations: A.slice(),
                    }),
                    a = K(E.end, _, et, { target: t.target, handle: r, listeners: n, doNotReject: !0, handleNumbers: e.handleNumbers }),
                    l = K("mouseout", _, Z, { target: t.target, handle: r, listeners: n, doNotReject: !0, handleNumbers: e.handleNumbers });
                n.push.apply(n, i.concat(a, l)),
                    t.cursor && ((q.style.cursor = getComputedStyle(t.target).cursor), g.length > 1 && f(N, s.cssClasses.drag), q.addEventListener("selectstart", o, !1)),
                    e.handleNumbers.forEach(function (t) {
                        lt("start", t);
                    });
            }
        }
        function nt(t) {
            t.stopPropagation();
            var e = Q(t.calcPoint),
                r = (function (t) {
                    var e = 100,
                        r = !1;
                    return (
                        g.forEach(function (n, i) {
                            if (!B(i)) {
                                var o = A[i],
                                    s = Math.abs(o - t);
                                (s < e || (s <= e && t > o) || (100 === s && 100 === e)) && ((r = i), (e = s));
                            }
                        }),
                        r
                    );
                })(e);
            !1 !== r &&
                (s.events.snap || a(N, s.cssClasses.tap, s.animationDuration), ht(r, e, !0, !0), pt(), lt("slide", r, !0), lt("update", r, !0), s.events.snap ? rt(t, { handleNumbers: [r] }) : (lt("change", r, !0), lt("set", r, !0)));
        }
        function it(t) {
            var e = Q(t.calcPoint),
                r = k.getStep(e),
                n = k.fromStepping(r);
            Object.keys(M).forEach(function (t) {
                "hover" === t.split(".")[0] &&
                    M[t].forEach(function (t) {
                        t.call(yt, n);
                    });
            });
        }
        function ot(t) {
            t.fixed ||
                g.forEach(function (t, e) {
                    K(E.start, t.children[0], rt, { handleNumbers: [e] });
                }),
                t.tap && K(E.start, h, nt, {}),
                t.hover && K(E.move, h, it, { hover: !0 }),
                t.drag &&
                    v.forEach(function (e, r) {
                        if (!1 !== e && 0 !== r && r !== v.length - 1) {
                            var n = g[r - 1],
                                i = g[r],
                                o = [e],
                                a = [n, i],
                                l = [r - 1, r];
                            f(e, s.cssClasses.draggable),
                                t.fixed && (o.push(n.children[0]), o.push(i.children[0])),
                                t.dragAll && ((a = g), (l = V)),
                                o.forEach(function (t) {
                                    K(E.start, t, rt, { handles: a, handleNumbers: l, connect: e });
                                });
                        }
                    });
        }
        function st(t, e) {
            (M[t] = M[t] || []),
                M[t].push(e),
                "update" === t.split(".")[0] &&
                    g.forEach(function (t, e) {
                        lt("update", e);
                    });
        }
        function at(t) {
            var e = t && t.split(".")[0],
                r = e ? t.substring(e.length) : t;
            Object.keys(M).forEach(function (t) {
                var n = t.split(".")[0],
                    i = t.substring(n.length);
                (e && e !== n) ||
                    (r && r !== i) ||
                    ((function (t) {
                        return t === y || t === x;
                    })(i) &&
                        r !== i) ||
                    delete M[t];
            });
        }
        function lt(t, e, r) {
            Object.keys(M).forEach(function (n) {
                var i = n.split(".")[0];
                t === i &&
                    M[n].forEach(function (t) {
                        t.call(yt, P.map(s.format.to), e, P.slice(), r || !1, A.slice(), yt);
                    });
            });
        }
        function ut(t, e, r, n, i, o, a) {
            var u;
            return (
                g.length > 1 &&
                    !s.events.unconstrained &&
                    (n && e > 0 && ((u = k.getAbsoluteDistance(t[e - 1], s.margin, !1)), (r = Math.max(r, u))), i && e < g.length - 1 && ((u = k.getAbsoluteDistance(t[e + 1], s.margin, !0)), (r = Math.min(r, u)))),
                g.length > 1 && s.limit && (n && e > 0 && ((u = k.getAbsoluteDistance(t[e - 1], s.limit, !1)), (r = Math.min(r, u))), i && e < g.length - 1 && ((u = k.getAbsoluteDistance(t[e + 1], s.limit, !0)), (r = Math.max(r, u)))),
                s.padding && (0 === e && ((u = k.getAbsoluteDistance(0, s.padding[0], !1)), (r = Math.max(r, u))), e === g.length - 1 && ((u = k.getAbsoluteDistance(100, s.padding[1], !0)), (r = Math.min(r, u)))),
                a || (r = k.getStep(r)),
                !((r = l(r)) === t[e] && !o) && r
            );
        }
        function ct(t, e) {
            var r = s.ort;
            return (r ? e : t) + ", " + (r ? t : e);
        }
        function ft(t, e, r, n, i) {
            var o = r.slice(),
                a = n[0],
                l = s.events.smoothSteps,
                u = [!t, t],
                c = [t, !t];
            (n = n.slice()),
                t && n.reverse(),
                n.length > 1
                    ? n.forEach(function (t, r) {
                          var n = ut(o, t, o[t] + e, u[r], c[r], !1, l);
                          !1 === n ? (e = 0) : ((e = n - o[t]), (o[t] = n));
                      })
                    : (u = c = [!0]);
            var f = !1;
            n.forEach(function (t, n) {
                f = ht(t, r[t] + e, u[n], c[n], !1, l) || f;
            }),
                f &&
                    (n.forEach(function (t) {
                        lt("update", t), lt("slide", t);
                    }),
                    null != i && lt("drag", a));
        }
        function dt(t, e) {
            return s.dir ? 100 - t - e : t;
        }
        function pt() {
            V.forEach(function (t) {
                var e = A[t] > 50 ? -1 : 1,
                    r = 3 + (g.length + e * t);
                g[t].style.zIndex = String(r);
            });
        }
        function ht(t, e, r, n, i, o) {
            return (
                i || (e = ut(A, t, e, r, n, !1, o)),
                !1 !== e &&
                    ((function (t, e) {
                        (A[t] = e), (P[t] = k.fromStepping(e));
                        var r = "translate(" + ct(dt(e, 0) - z + "%", "0") + ")";
                        if (((g[t].style[s.transformRule] = r), s.events.invertConnects && A.length > 1)) {
                            var n = A.every(function (t, e, r) {
                                return 0 === e || t >= r[e - 1];
                            });
                            if (D !== !n)
                                return (
                                    (D = !D),
                                    U(
                                        s,
                                        s.connect.map(function (t) {
                                            return !t;
                                        })
                                    ),
                                    void xt()
                                );
                        }
                        mt(t), mt(t + 1), D && (mt(t - 1), mt(t + 2));
                    })(t, e),
                    !0)
            );
        }
        function mt(t) {
            if (v[t]) {
                var e = A.slice();
                D &&
                    e.sort(function (t, e) {
                        return t - e;
                    });
                var r = 0,
                    n = 100;
                0 !== t && (r = e[t - 1]), t !== v.length - 1 && (n = e[t]);
                var i = n - r,
                    o = "translate(" + ct(dt(r, i) + "%", "0") + ")",
                    a = "scale(" + ct(i / 100, "1") + ")";
                v[t].style[s.transformRule] = o + " " + a;
            }
        }
        function gt(t, e) {
            return null === t || !1 === t || void 0 === t ? A[e] : ("number" == typeof t && (t = String(t)), !1 !== (t = s.format.from(t)) && (t = k.toStepping(t)), !1 === t || isNaN(t) ? A[e] : t);
        }
        function vt(t, e, r) {
            var n = u(t),
                i = void 0 === A[0];
            (e = void 0 === e || e),
                s.animate && !i && a(N, s.cssClasses.tap, s.animationDuration),
                V.forEach(function (t) {
                    ht(t, gt(n[t], t), !0, !1, r);
                });
            var o = 1 === V.length ? 0 : 1;
            if (i && k.hasNoSize() && ((r = !0), (A[0] = 0), V.length > 1)) {
                var l = 100 / (V.length - 1);
                V.forEach(function (t) {
                    A[t] = t * l;
                });
            }
            for (; o < V.length; ++o)
                V.forEach(function (t) {
                    ht(t, A[t], !0, !0, r);
                });
            pt(),
                V.forEach(function (t) {
                    lt("update", t), null !== n[t] && e && lt("set", t);
                });
        }
        function bt(t) {
            if ((void 0 === t && (t = !1), t)) return 1 === P.length ? P[0] : P.slice(0);
            var e = P.map(s.format.to);
            return 1 === e.length ? e[0] : e;
        }
        function St(t) {
            var e = A[t],
                r = k.getNearbySteps(e),
                n = P[t],
                i = r.thisStep.step,
                o = null;
            if (s.snap) return [n - r.stepBefore.startValue || null, r.stepAfter.startValue - n || null];
            !1 !== i && n + i > r.stepAfter.startValue && (i = r.stepAfter.startValue - n),
                (o = n > r.thisStep.startValue ? r.thisStep.step : !1 !== r.stepBefore.step && n - r.stepBefore.highestStep),
                100 === e ? (i = null) : 0 === e && (o = null);
            var a = k.countStepDecimals();
            return null !== i && !1 !== i && (i = Number(i.toFixed(a))), null !== o && !1 !== o && (o = Number(o.toFixed(a))), [o, i];
        }
        function xt() {
            for (; m.firstChild; ) m.removeChild(m.firstChild);
            for (var t = 0; t <= s.handles; t++) (v[t] = F(m, s.connect[t])), mt(t);
            ot({ drag: s.events.drag, fixed: !0 });
        }
        f((w = N), s.cssClasses.target),
            0 === s.dir ? f(w, s.cssClasses.ltr) : f(w, s.cssClasses.rtl),
            0 === s.ort ? f(w, s.cssClasses.horizontal) : f(w, s.cssClasses.vertical),
            f(w, "rtl" === getComputedStyle(w).direction ? s.cssClasses.textDirectionRtl : s.cssClasses.textDirectionLtr),
            (h = j(w, s.cssClasses.base)),
            (function (t, e) {
                (m = j(e, s.cssClasses.connects)), (g = []), (v = []).push(F(m, t[0]));
                for (var r = 0; r < s.handles; r++) g.push(H(e, r)), (V[r] = r), v.push(F(m, t[r + 1]));
            })(s.connect, h),
            ot(s.events),
            vt(s.start),
            s.pips && G(s.pips),
            s.tooltips && X(),
            at("update" + y),
            st("update" + y, function (t, e, r, n, i) {
                V.forEach(function (t) {
                    var e = g[t],
                        n = ut(A, t, 0, !0, !0, !0),
                        o = ut(A, t, 100, !0, !0, !0),
                        a = i[t],
                        l = String(s.ariaFormat.to(r[t]));
                    (n = k.fromStepping(n).toFixed(1)),
                        (o = k.fromStepping(o).toFixed(1)),
                        (a = k.fromStepping(a).toFixed(1)),
                        e.children[0].setAttribute("aria-valuemin", n),
                        e.children[0].setAttribute("aria-valuemax", o),
                        e.children[0].setAttribute("aria-valuenow", a),
                        e.children[0].setAttribute("aria-valuetext", l);
                });
            });
        var yt = {
            destroy: function () {
                for (
                    at(y),
                        at(x),
                        Object.keys(s.cssClasses).forEach(function (t) {
                            d(N, s.cssClasses[t]);
                        });
                    N.firstChild;

                )
                    N.removeChild(N.firstChild);
                delete N.noUiSlider;
            },
            steps: function () {
                return V.map(St);
            },
            on: st,
            off: at,
            get: bt,
            set: vt,
            setHandle: function (t, e, r, n) {
                if (!((t = Number(t)) >= 0 && t < V.length)) throw new Error("noUiSlider: invalid handle number, got: " + t);
                ht(t, gt(e, t), !0, !0, n), lt("update", t), r && lt("set", t);
            },
            reset: function (t) {
                vt(s.start, t);
            },
            disable: function (t) {
                null != t
                    ? (g[t].setAttribute("disabled", ""), g[t].handle.removeAttribute("tabindex"))
                    : (N.setAttribute("disabled", ""),
                      g.forEach(function (t) {
                          t.handle.removeAttribute("tabindex");
                      }));
            },
            enable: function (t) {
                null != t
                    ? (g[t].removeAttribute("disabled"), g[t].handle.setAttribute("tabindex", "0"))
                    : (N.removeAttribute("disabled"),
                      g.forEach(function (t) {
                          t.removeAttribute("disabled"), t.handle.setAttribute("tabindex", "0");
                      }));
            },
            __moveHandles: function (t, e, r) {
                ft(t, e, A, r);
            },
            options: c,
            updateOptions: function (t, e) {
                var r = bt(),
                    n = ["margin", "limit", "padding", "range", "animate", "snap", "step", "format", "pips", "tooltips", "connect"];
                n.forEach(function (e) {
                    void 0 !== t[e] && (c[e] = t[e]);
                });
                var o = Y(c);
                n.forEach(function (e) {
                    void 0 !== t[e] && (s[e] = o[e]);
                }),
                    (k = o.spectrum),
                    (s.margin = o.margin),
                    (s.limit = o.limit),
                    (s.padding = o.padding),
                    s.pips ? G(s.pips) : $(),
                    s.tooltips ? X() : I(),
                    (A = []),
                    vt(i(t.start) ? t.start : r, e),
                    t.connect && xt();
            },
            target: N,
            removePips: $,
            removeTooltips: I,
            getPositions: function () {
                return A.slice();
            },
            getTooltips: function () {
                return S;
            },
            getOrigins: function () {
                return g;
            },
            pips: G,
        };
        return yt;
    }
    const $ = function (t, e) {
        if (!t || !t.nodeName) throw new Error("noUiSlider: create requires a single element, got: " + t);
        if (t.noUiSlider) throw new Error("noUiSlider: Slider was already initialized.");
        var r = W(t, Y(e), e);
        return (t.noUiSlider = r), r;
    };
    document.querySelectorAll(".filters__price-range").forEach((t) => {
        $(t, {
            start: [6e5, 106e5],
            connect: !0,
            range: { min: 6e5, max: 106e5 },
            behaviour: "tap-drag",
            step: 1e4,
            format: {
                to: function (t) {
                    return Math.round(t);
                },
                from: function (t) {
                    return Number(t);
                },
            },
        });
        const e = document.getElementById("price-min"),
            r = document.getElementById("price-max"),
            n = document.querySelector(".price-min"),
            i = document.querySelector(".price-max");
        t.noUiSlider.on("update", (t) => {
            (e.value = t[0]), (r.value = t[1]), (n.value = t[0]), (i.value = t[1]);
        }),
            e.addEventListener("change", function () {
                t.noUiSlider.set([this.value, null]);
            }),
            r.addEventListener("change", function () {
                t.noUiSlider.set([null, this.value]);
            }),
            n.addEventListener("change", function () {
                t.noUiSlider.set([this.value, null]);
            }),
            i.addEventListener("change", function () {
                t.noUiSlider.set([this.value, null]);
            });
    });
    const G = document.querySelectorAll(".filters__characteristics-options div");
    G.length > 0 &&
        G.forEach((t) => {
            t.addEventListener("click", function () {
                t.classList.toggle("active");
            }),
                G[0].addEventListener("click", function () {
                    var t, e;
                    (t = G[0]),
                        (e = G),
                        t.classList.contains("active") &&
                            e.forEach((e) => {
                                e.classList.remove("active"), t.classList.add("active");
                            });
                });
        });
    let J = document.querySelectorAll(".dropdown__block");
    function K(t) {
        let e = t.querySelector(".dropdown__arrow"),
            r = t.querySelector(".dropdown__block-content"),
            n = Q(t);
        e.classList.remove("active"), r.classList.remove("show"), Z(t, n);
    }
    function Q(t) {
        let e = t.querySelectorAll('input[type="checkbox"]:checked'),
            r = Array.from(e)
                .map((t) => {
                    let e = t.closest("label");
                    return e ? e.textContent.trim() : t.value;
                })
                .join(", ");
        return r.length > 35 && (r = r.substring(0, 35) + "..."), r;
    }
    function Z(t, e) {
        let r = t.querySelector("span");
        e.length > 0 ? (r.textContent = e) : (r.textContent = "Не важно");
    }
    J.forEach((t) => {
        t.addEventListener("click", function (e) {
            e.stopPropagation(),
                J.forEach((e) => {
                    e !== t && K(e);
                }),
                t.querySelector(".dropdown__block-content").classList.contains("show")
                    ? K(t)
                    : (function (t) {
                          let e = t.querySelector(".dropdown__arrow"),
                              r = t.querySelector(".dropdown__block-content");
                          e.classList.add("active"), r.classList.add("show");
                      })(t);
        });
    }),
        document.addEventListener("click", function (t) {
            t.target.closest(".dropdown__block") ||
                J.forEach((t) => {
                    K(t);
                });
        }),
        J.forEach((t) => {
            !(function (t) {
                Z(t, Q(t));
            })(t);
        }),
        document.querySelectorAll(".clear-filters").forEach((t) => {
            t.addEventListener("click", function () {
                !(function () {
                    const t = document.getElementById("range"),
                        e = document.querySelector(".filters__price-range");
                    G.forEach((t) => {
                        t.classList.remove("active");
                    }),
                        document.querySelectorAll('input[type="checkbox"]:checked').forEach((t) => {
                            t.checked = !1;
                        }),
                        J.forEach((t) => {
                            Z(t, "Не важно");
                        }),
                        t.noUiSlider.reset(),
                        e.noUiSlider.reset();
                })();
            });
        }),
        (function (t, e, r) {
            let n = document.querySelector(t),
                i = document.querySelector(r),
                o = document.querySelector(e);
            o.addEventListener("click", function (t) {
                n.classList.add("show");
            }),
                i.addEventListener("click", function (t) {
                    n.classList.remove("show"), t.stopPropagation();
                }),
                document.addEventListener("click", function (t) {
                    n.contains(t.target) || o.contains(t.target) || n.classList.remove("show");
                });
        })(".filters-mobile", ".filt-btn", ".filters-mobile__close");
})();
