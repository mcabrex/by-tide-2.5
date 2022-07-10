class Header extends HTMLElement {
    constructor() {
        super()
        this.isHomePage = window.location.pathname === '/' ? true : false
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
        //these functions are called from left to right
        this.getHeaderHeights(), this.setHeaderFill(), this.setThresholdValues(), this.createObserver()
    }
    getHeaderHeights() {
        const e = this.cloneNode(!0),
            t = (e.setAttribute("data-fixed", !0), this.cloneNode(!0));
        t.setAttribute("data-fixed", !1), this.fixed_height = theme.utils.getHiddenElHeight(e, !1), this.unfixed_height = theme.utils.getHiddenElHeight(t, !1)
    }
    setHeaderFill() {
        //TRACK THE PIXEL THRESHOLD
        if(this.isHomePage){
            this.header_fill.style.height = 0, this.style.top = this.header_fill.offset().top + "px"
        } else {
            this.header_fill.style.height = this.unfixed_height + "px", this.style.top = this.header_fill.offset().top + "px"
        }
        // this.header_fill.style.height = 0 + "px", this.style.top = this.header_fill.offset().top + "px"
    }
    setThresholdValues() {
        this.pixel_threshold = this.unfixed_height - this.fixed_height, this.observer_threshold = +(1 - this.pixel_threshold / this.unfixed_height).toFixed(4), 1 < this.observer_threshold && (this.observer_threshold = 1)
    }
    createObserver() {
        this.observer && this.observer.unobserve(this.header_fill), this.observer = new IntersectionObserver(() => this.detectAndFixHeader(), {
            threshold: this.observer_threshold
        }), this.observer.observe(this.header_fill)
    }
    detectAndFixHeader() {
        if (!Shopify.inspectMode) {
            let e;
            e = this.announcement ? this.pixel_threshold + this.announcement.offsetHeight : this.pixel_threshold 
            
            if(this.isHomePage){
                window.pageYOffset >= this.announcement.offsetHeight && !this.fixed_state ? this.fixHeader(!0) : window.pageYOffset < e && this.fixed_state && this.fixHeader(!1)
            } else {
                window.pageYOffset >= e && !this.fixed_state ? this.fixHeader(!0) : window.pageYOffset < e && this.fixed_state && this.fixHeader(!1)
            }
            console.log('pixel threshold e',{
                e,
                pixelThresh: this.pixel_threshold,
                anouncedOffset: this.announcement.offsetHeight,
                pageyoffy: window.pageYOffset,
                fixed: this.fixed_state,
                webber: this.isHomePage
            })
        }
    }
    fixHeader(e) {
        this.fixed_state = e, this.setAttribute("data-fixed", e) 
        if(e){
            this.trigger("fixed")
            if(this.isHomePage){
                this.style.backgroundColor = 'var(--bg-color--header)'
                this.style.borderBottom = '1px solid var(--bdr-color--header)'
            } 
        } else {
            this.trigger("unfixed")
            if(this.isHomePage){
                this.style.backgroundColor = 'transparent'
                this.style.borderBottom = 'none'
            }
        }
    }
}
customElements.define("header-root", Header);