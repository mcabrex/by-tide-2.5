class Header extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        this.announcement = document.querySelector(".announcement--root"), this.container = this.querySelector(".header--container"), this.current_width = window.innerWidth, this.fixed_enabled = "true" === this.getAttribute("data-fixed-enabled"), this.fixed_state = !1;
        var e = this.querySelector(".y-menu"),
            t = document.querySelector(".mobile-nav--menu"),
            i = this.querySelector(".header--localization-for-off-canvas > *"),
            s = document.querySelector(".mobile-nav--localization"),
            h = document.querySelector(".mobile-nav--login"),
            r = this.querySelector(".mobile-nav--login--for-off-canvas > *"),
            n = document.querySelector(".mobile-nav--search");
        this.mobile_nav_search_icon = this.querySelector(".mobile-nav--search--for-off-canvas > *"), this.element_pairs = [{
            parent: t,
            child: e
        }, {
            parent: h,
            child: r
        }, {
            parent: n,
            child: this.mobile_nav_search_icon
        }, {
            parent: s,
            child: i
        }], this.load()
    }
    load() {
        this.element_pairs.forEach(e => this.moveElement(e.parent, e.child)), Shopify.designMode && (this.sectionListeners(), this.inspectListeners()), this.fixed_enabled && (this.header_fill = this.previousElementSibling, this.initFixed(), window.on("theme:XMenu:loaded", () => this.initFixed()))
    }
    moveElement(e, t) {
        e && (e.innerHTML = ""), e && t && e.appendChild(t)
    }
    sectionListeners() {
        this.on("theme:section:load", () => {
            window.trigger("theme:modal:close"), theme.off_canvas.reset(), this.mobile_nav_search_icon && window.trigger("theme:search:updateLinks")
        })
    }
    inspectListeners() {
        this.fixed_enabled && (document.addEventListener("shopify:inspector:activate", () => this.fixHeader(!1)), document.addEventListener("shopify:inspector:deactivate", () => {
            setTimeout(() => this.detectAndFixHeader(), 0)
        }))
    }
    initFixed() {
        this.getHeaderHeights(), this.setHeaderFill(), this.setThresholdValues(), this.createObserver()
    }
    getHeaderHeights() {
        const e = this.cloneNode(!0),
            t = (e.setAttribute("data-fixed", !0), this.cloneNode(!0));
        t.setAttribute("data-fixed", !1), this.fixed_height = theme.utils.getHiddenElHeight(e, !1), this.unfixed_height = theme.utils.getHiddenElHeight(t, !1)
    }
    setHeaderFill() {
        if(window.location.pathname == "/"){
            this.header_fill.style.height = 0 + "px", this.style.top = this.header_fill.offset().top + "px"
        } else {
            this.header_fill.style.height = this.unfixed_height + "px", this.style.top = this.header_fill.offset().top + "px"
        }
    }
    setThresholdValues() {
        this.pixel_threshold = this.unfixed_height - this.fixed_height, this.observer_threshold = +(1 - this.pixel_threshold / this.unfixed_height).toFixed(4), 1 < this.observer_threshold && (this.observer_threshold = 1)
        console.log(this.pixel_threshold,'pixel_threshold')
    }
    createObserver() {
        this.observer && this.observer.unobserve(this.header_fill), this.observer = new IntersectionObserver(() => this.detectAndFixHeader(), {
            threshold: this.observer_threshold
        }), this.observer.observe(this.header_fill)
    }
    detectAndFixHeader() {
        //STARTING FIXED FOR SOME REASON
        if (!Shopify.inspectMode) {
            let e;
            if(window.location.pathname == "/"){
                e = this.announcement ? this.pixel_threshold + this.announcement.offsetHeight : this.pixel_threshold, window.pageYOffset > 0 && !this.fixed_state ? this.fixHeader(!0) : window.pageYOffset === 0 && this.fixed_state && this.fixHeader(!1)
                if(window.pageYOffset > 0){
                    this.style.backgroundColor = "var(--bg-color--header)"
                } else {
                    this.style.backgroundColor = "transparent"
                    this.style.borderBottom = "none"
                }
            } else {
                e = this.announcement ? this.pixel_threshold + this.announcement.offsetHeight : this.pixel_threshold, window.pageYOffset >= e && !this.fixed_state ? this.fixHeader(!0) : window.pageYOffset < e && this.fixed_state && this.fixHeader(!1)
            }
        }
    }
    fixHeader(e) {
        this.fixed_state = e, this.setAttribute("data-fixed", e), e ? this.trigger("fixed") : this.trigger("unfixed")
    }
}
customElements.define("header-root", Header);