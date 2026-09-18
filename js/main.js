/* ============================================================
   STACKLY — main.js
   Shared utilities: navbar, footer, page loader, scroll reveal,
   animated counters, toasts, canvas pie charts, page forms.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- tiny DOM helpers ---------- */
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ============ PAGE LOADER (page loading animation) ============ */
  function initLoader() {
    if ($("#pageLoader")) return;
    const pl = document.createElement("div");
    pl.id = "pageLoader";
    pl.className = "loader";
    pl.innerHTML = '<div><div class="loader-ring"></div><b><img class="brand-logo loader-logo" src="assets/icons/images/Stackly_logo.png" alt="Stackly logo"></b></div>';
    document.body.prepend(pl);
    const hide = () => { pl.classList.add("hide"); setTimeout(() => pl.remove(), 450); };
    window.addEventListener("load", hide);
    setTimeout(hide, 2500); /* safety fallback */
  }

  /* ============ PUBLIC NAVBAR ============ */
  function renderSiteNav() {
    const root = $("#navRoot");
    if (!root) return;
    const page = document.body.dataset.page || "";
    const links = [
      { label: "Home", icon: "fa-house", href: "index.html", page: "home" },
      { label: "About", icon: "fa-circle-info", href: "about.html", page: "about" },
      { label: "Services", icon: "fa-layer-group", href: "services.html", page: "services" },
      { label: "Banking", icon: "fa-building-columns", href: "banking.html", page: "banking" },
      { label: "Payments", icon: "fa-money-check-dollar", href: "payments.html", page: "payments" },
      { label: "Investments", icon: "fa-chart-line", href: "investments.html", page: "investments" },
      { label: "Loans", icon: "fa-hand-holding-dollar", href: "loans.html", page: "loans" },
      { label: "Contact", icon: "fa-headset", href: "contact.html", page: "contact" },
    ];
    /* Keep the public navbar identical on every page. Feature pages remain
       reachable from the home/services content, but do not add extra nav items. */
    const visibleLinks = links.filter((l) => !["banking", "payments", "investments"].includes(l.page));
    const renderLinks = (items) => items
      .map((l) => `<a href="${l.href}" class="nav-link ${page === l.page ? "active" : ""}"><i class="fa-solid ${l.icon}"></i>${l.label}</a>`)
      .join("");
    const linkHTML = renderLinks(visibleLinks);

    root.innerHTML = `
      <nav class="navbar" aria-label="Main navigation">
        <div class="container">
          <a href="index.html" class="nav-logo" aria-label="Stackly home"><img class="brand-logo" src="assets/icons/images/Stackly_logo.png" alt="Stackly logo"></a>
          <button class="nav-toggle" aria-label="Open menu"><i class="fa-solid fa-bars"></i></button>
          <div class="nav-overlay"></div>
          <div class="nav-menu">
            <button class="nav-close" aria-label="Close menu"><i class="fa-solid fa-xmark"></i></button>
            ${linkHTML}
            <div class="nav-auth">
              <a href="login.html" class="nav-cta nav-login ${page === "login" ? "active" : ""}"><i class="fa-solid fa-user"></i>Login</a>
              <a href="signup.html" class="nav-cta nav-signup ${page === "signup" ? "active" : ""}"><i class="fa-solid fa-user-plus"></i>Sign Up</a>
            </div>
          </div>
        </div>
      </nav>`;

    const navbar = $(".navbar");
    const menu = $(".nav-menu");
    const overlay = $(".nav-overlay");
    const toggleIcon = (open) => {
      const toggle = $(".nav-toggle");
      if (toggle) toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    };
    const openMenu = () => { menu.classList.add("open"); overlay.classList.add("show"); document.body.style.overflow = "hidden"; toggleIcon(true); };
    const closeMenu = () => { menu.classList.remove("open"); overlay.classList.remove("show"); document.body.style.overflow = ""; toggleIcon(false); };

    $(".nav-toggle").addEventListener("click", () => {
      if (menu.classList.contains("open")) closeMenu();
      else openMenu();
    });
    $(".nav-close").addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
    $$(".nav-link").forEach((a) => a.addEventListener("click", closeMenu));

    /* navbar expands on scroll */
    const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ============ PUBLIC FOOTER ============ */
  function renderSiteFooter() {
    const root = $("#footerRoot");
    if (!root) return;
    const y = new Date().getFullYear();
    root.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a href="index.html" class="nav-logo" style="font-size:1.4rem" aria-label="Stackly home"><img class="brand-logo" src="assets/icons/images/Stackly_logo.png" alt="Stackly logo"></a>
              <p>Modern digital banking & financial services for individuals and businesses. Secure, fast and transparent.</p>
              <div class="socials">
                <a href="404.html" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
                <a href="404.html" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="404.html" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                <a href="404.html" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
              </div>
            </div>
            <div class="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="about.html">About Us</a></li>
                <li><a href="services.html">Services</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="login.html">Login</a></li>
                <li><a href="signup.html">Sign Up</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Products</h4>
              <ul>
                <li><a href="banking.html">Digital Banking</a></li>
                <li><a href="payments.html">Payments</a></li>
                <li><a href="investments.html">Investments</a></li>
                <li><a href="loans.html">Loans</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Support</h4>
              <ul>
                <li><a href="contact.html">Help Center</a></li>
                <li><a href="contact.html">Security</a></li>
                <li><a href="contact.html">Privacy Policy</a></li>
                <li><a href="contact.html">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${y} STACKLY Financial Services. All rights reserved.</span>
            <span>Made with care for digital banking <i class="fa-solid fa-heart" style="color:var(--pink)"></i></span>
          </div>
        </div>
      </footer>`;
  }

  /* ============ SCROLL REVEAL + ANIMATED COUNTERS ============ */
  function runCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const target = parseFloat(el.dataset.target || "0");
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1600;
    const start = performance.now();
    const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + fmt(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + fmt(target) + suffix;
    };
    requestAnimationFrame(tick);
  }

  function initAnimations() {
    if (document.body.dataset.animInited) return;
    document.body.dataset.animInited = "1";
    const targets = $$(".reveal, .rv, .counter");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add("in");
            if (el.classList.contains("counter")) runCounter(el);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((el) => obs.observe(el));
  }

  /* ============ TOAST NOTIFICATIONS ============ */
  function showToast(title, message, type) {
    type = type || "success";
    let wrap = $(".toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
    const icons = { success: "fa-circle-check", error: "fa-circle-exclamation", info: "fa-circle-info" };
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.innerHTML = `<div class="t-icon"><i class="fa-solid ${icons[type] || icons.info}"></i></div><div><b>${title}</b><span>${message}</span></div>`;
    wrap.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 450); }, 3200);
  }

  /* ============ CANVAS PIE / DONUT CHART ============ */
  const PIE_DEFS = [];

  function drawPie(canvasId, data, colors, opts) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const box = canvas.parentElement.getBoundingClientRect();
    const w = box.width || 300;
    const h = box.height || 300;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = w / 2, cy = h / 2;
    const r = Math.min(w, h) / 2 - 8;
    const total = data.reduce((a, b) => a + (b || 0), 0) || 1;
    let angle = -Math.PI / 2;
    const hole = opts && opts.hole;

    /* subtle hover rings are drawn per slice */
    data.forEach((v, i) => {
      const slice = (v / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + slice);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = (opts && opts.holeColor) || "#fff";
      ctx.stroke();
      angle += slice;
    });

    if (hole) {
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = (opts && opts.holeColor) || "#ffffff";
      ctx.fill();
    }
  }

  function registerPie(canvasId, data, colors, opts) {
    PIE_DEFS.push({ id: canvasId, data, colors, opts });
    drawPie(canvasId, data, colors, opts);
  }

  if (window.addEventListener) {
    window.addEventListener("resize", () => PIE_DEFS.forEach((p) => drawPie(p.id, p.data, p.colors, p.opts)));
  }

  /* ============ INNER PAGE: contact form ============ */
  function initContactForm() {
    const form = $("#contactForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$(".form-control", form).forEach((f) => {
        const val = f.value.trim();
        let valid = val !== "";
        if (f.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        f.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) { showToast("Check your details", "Please fill all required fields correctly.", "error"); return; }
      const success = $("#contactSuccess");
      if (success) { success.classList.add("show"); form.reset(); setTimeout(() => success.classList.remove("show"), 6000); }
      showToast("Message sent!", "Our support team will reach out within 24 hours.", "success");
    });
    $$(".form-control", form).forEach((f) => f.addEventListener("input", () => f.classList.remove("invalid")));
  }

  /* ============ INNER PAGE: payments quick form ============ */
  function initPayForm() {
    const form = $("#quickPayForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = ($("#quickName") && $("#quickName").value.trim()) || "";
      const id = ($("#quickUpi") && $("#quickUpi").value.trim()) || "";
      const amount = parseFloat(($("#quickAmount") && $("#quickAmount").value) || 0);
      if (!name || !/^[\w.\-]+@[\w.\-]+$/.test(id) || !(amount > 0)) {
        showToast("Invalid details", "Please check the recipient and amount you entered.", "error");
        return;
      }
      showToast("Payment Successful!", "Sent " + amount.toLocaleString("en-US", { style: "currency", currency: "INR" }) + " to " + name + ".", "success");
      form.reset();
    });
  }

  /* ============ INNER PAGE: investment projection form ============ */
  function initInvestForm() {
    const form = $("#investForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const amount = parseFloat(($("#investAmount") && $("#investAmount").value) || 0);
      const years = parseFloat(($("#investYears") && $("#investYears").value) || 0);
      const risk = ($("#investRisk") && $("#investRisk").value) || "medium";
      const rate = { low: 0.08, medium: 0.12, high: 0.16 }[risk] || 0.12;
      if (!(amount > 0) || !(years > 0)) {
        showToast("Invalid input", "Please enter a valid amount and tenure.", "error");
        return;
      }
      const projected = amount * Math.pow(1 + rate, years);
      const el = $("#projectedValue");
      if (el) {
        el.innerHTML =
          '<i class="fa-solid fa-chart-line"></i><div>' +
          '<b style="font-family:var(--font-head);font-size:1.55rem;color:var(--green)">₹ ' +
          projected.toLocaleString("en-IN", { maximumFractionDigits: 0 }) +
          "</b><br><span style='font-size:.8rem;color:var(--muted)'>Estimated value after " +
          years + " years at ~" + Math.round(rate * 100) + "% p.a.</span></div>";
        el.classList.add("show");
      }
      showToast("Projection ready", "Estimated portfolio value calculated.", "success");
    });
  }

  /* ============ INNER PAGE: loan calculator ============ */
  function initLoanCalc() {
    const amount = $("#loanAmount"), rate = $("#loanRate"), tenure = $("#loanTenure");
    if (!amount || !rate || !tenure) return;
    const outMonthly = $("#emiVal"), outInterest = $("#interestVal"), outTotal = $("#totalVal"), outPrincipal = $("#principalVal");
    const fmt = (n) => "₹ " + Math.round(n).toLocaleString("en-IN");

    function calc() {
      const P = parseFloat(amount.value) || 0;
      const annual = parseFloat(rate.value) || 0;
      const years = parseFloat(tenure.value) || 0;
      if (P <= 0 || annual <= 0 || years <= 0) {
        outMonthly.textContent = "₹ 0"; outInterest.textContent = "₹ 0"; outTotal.textContent = "₹ 0";
        if (outPrincipal) outPrincipal.textContent = "₹ 0";
        return;
      }
      const n = years * 12;
      const r = annual / 12 / 100;
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = emi * n;
      outMonthly.textContent = fmt(emi);
      outInterest.textContent = fmt(total - P);
      outTotal.textContent = fmt(total);
      if (outPrincipal) outPrincipal.textContent = fmt(P);
    }

    /* keep range+number outputs in sync */
    function bind(id, outId, fmtFn) {
      const input = document.getElementById(id);
      const out = document.getElementById(outId);
      if (!input) return;
      const sync = () => { if (out) out.textContent = fmtFn ? fmtFn(input.value) : input.value; };
      input.addEventListener("input", () => { sync(); calc(); });
      sync();
    }
    bind("loanAmount", "amountOut", (v) => "₹ " + Number(v).toLocaleString("en-IN"));
    bind("loanRate", "rateOut", (v) => v + "%");
    bind("loanTenure", "tenureOut", (v) => v + " yrs");
    calc();
  }

  /* ============ OFFLINE IMAGE FALLBACK ============
     If an external image fails to load (offline / rate-limited),
     swap in a local branded gradient placeholder. */
  const FALLBACK_IMG =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">' +
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#2742f5"/><stop offset="0.5" stop-color="#7c3aed"/>' +
        '<stop offset="1" stop-color="#06b6d4"/></linearGradient></defs>' +
        '<rect width="1200" height="800" fill="url(#g)"/>' +
        '<rect x="20" y="20" width="1160" height="760" rx="24" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/>' +
        '<text x="600" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="#ffffff">STACKLY</text>' +
        '<text x="600" y="450" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,.9)">Digital Banking &amp; Financial Services</text>' +
        "</svg>"
    );

  function initImageFallback() {
    const fix = (img) => { if (img.complete && img.naturalWidth === 0) img.src = FALLBACK_IMG; };
    $$("img").forEach((img) => {
      img.addEventListener("error", () => { img.src = FALLBACK_IMG; }, { once: true });
      fix(img);
    });
  }

  /* ============ VIEWPORT-SAFE CUSTOM SELECTS ============ */
  function initCustomSelects() {
    const selects = $$('select.form-control:not([data-custom-ready])');
    if (!selects.length) return;

    const closeDropdown = (wrap) => {
      if (!wrap) return;
      wrap.classList.remove('open');
      const menu = wrap._customSelectMenu || $('.custom-select-menu', wrap);
      const button = $('.custom-select-button', wrap);
      if (menu) menu.classList.remove('is-open');
      if (button) button.setAttribute('aria-expanded', 'false');
    };

    const closeAll = (except) => {
      $$('.custom-select.open').forEach((wrap) => {
        if (wrap !== except) closeDropdown(wrap);
      });
    };

    const positionMenu = (wrap) => {
      if (!wrap.classList.contains('open')) return;
      const button = $('.custom-select-button', wrap);
      const menu = wrap._customSelectMenu || $('.custom-select-menu', wrap);
      if (!button || !menu) return;
      const rect = button.getBoundingClientRect();
      const viewportPad = 10;
      const menuHeight = Math.min(menu.scrollHeight || 260, window.innerHeight - viewportPad * 2);
      const spaceBelow = window.innerHeight - rect.bottom - viewportPad;
      const top = spaceBelow >= Math.min(menuHeight, 260)
        ? rect.bottom + 6
        : Math.max(viewportPad, rect.top - menuHeight - 6);
      const width = Math.min(rect.width, window.innerWidth - viewportPad * 2);
      const left = Math.min(Math.max(viewportPad, rect.left), window.innerWidth - width - viewportPad);
      Object.assign(menu.style, { top: `${top}px`, left: `${left}px`, width: `${width}px` });
    };

    selects.forEach((select) => {
      select.dataset.customReady = '1';
      const wrap = document.createElement('div');
      wrap.className = 'custom-select';
      select.parentNode.insertBefore(wrap, select);
      wrap.appendChild(select);

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'custom-select-button';
      button.setAttribute('aria-haspopup', 'listbox');
      button.setAttribute('aria-expanded', 'false');
      button.innerHTML = '<span class="custom-select-label"></span><i class="fa-solid fa-chevron-down" aria-hidden="true"></i>';
      wrap.appendChild(button);

      const menu = document.createElement('div');
      menu.className = 'custom-select-menu';
      menu.setAttribute('role', 'listbox');
      /* Keep the menu out of animated/overflowing form containers.  A fixed
         element inside a transformed auth card can otherwise be positioned
         against that card instead of the viewport. */
      wrap._customSelectMenu = menu;
      document.body.appendChild(menu);

      const label = $('.custom-select-label', button);
      const sync = () => {
        const option = select.options[select.selectedIndex];
        label.textContent = option ? option.textContent : '';
        $$('.custom-select-option', menu).forEach((item) => item.classList.toggle('selected', item.dataset.value === select.value));
      };

      Array.from(select.options).forEach((option) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'custom-select-option';
        item.dataset.value = option.value;
        item.textContent = option.textContent;
        item.disabled = option.disabled;
        item.setAttribute('role', 'option');
        item.addEventListener('click', () => {
          if (option.disabled) return;
          select.value = option.value;
          select.dispatchEvent(new Event('input', { bubbles: true }));
          select.dispatchEvent(new Event('change', { bubbles: true }));
          sync();
          closeDropdown(wrap);
        });
        menu.appendChild(item);
      });

      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const open = !wrap.classList.contains('open');
        closeAll(wrap);
        wrap.classList.toggle('open', open);
        menu.classList.toggle('is-open', open);
        button.setAttribute('aria-expanded', String(open));
        if (open) positionMenu(wrap);
      });
      select.addEventListener('change', sync);
      if (select.form) select.form.addEventListener('reset', () => setTimeout(sync, 0));
      sync();
    });

    document.addEventListener('pointerdown', (event) => {
      const open = $('.custom-select.open');
      const menu = open && open._customSelectMenu;
      if (open && !open.contains(event.target) && !(menu && menu.contains(event.target))) closeDropdown(open);
    }, true);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeAll();
    });
    window.addEventListener('resize', () => $$('.custom-select.open').forEach(positionMenu), { passive: true });
    window.addEventListener('scroll', () => $$('.custom-select.open').forEach(positionMenu), { passive: true });
  }

  /* ============ BOOT ============ */
  document.addEventListener("DOMContentLoaded", () => {
    initImageFallback();
    renderSiteNav();
    renderSiteFooter();
    initAnimations();
    initContactForm();
    initPayForm();
    initInvestForm();
    initLoanCalc();
    initCustomSelects();
  });
  window.addEventListener("load", initImageFallback);

  /* ============ EXPOSE SHARED HELPERS ============
     dashboard.js / auth.js and inline page scripts rely on
     these utilities, so make them available globally.      */
  window.$ = $;
  window.$$ = $$;
  window.showToast = showToast;
  window.drawPie = drawPie;
  window.registerPie = registerPie;
  window.initAnimations = initAnimations;
  window.runCounter = runCounter;
})();
