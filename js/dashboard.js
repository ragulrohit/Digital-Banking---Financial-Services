/* ============================================================
   STACKLY — dashboard.js
   Dashboard shell (sidebar + header + logout modal), shared
   transaction dataset, and all dashboard page behaviours.
   ============================================================ */
(function () {
  "use strict";

  const DASH_PAGES = [
    { page: "overview", label: "Overview", icon: "fa-chart-pie", href: "overview.html" },
    { page: "accounts", label: "My Accounts", icon: "fa-building-columns", href: "accounts.html" },
    { page: "transactions", label: "Transactions", icon: "fa-arrow-right-arrow-left", href: "transactions.html" },
    { page: "payments", label: "Payments", icon: "fa-money-bill-transfer", href: "dashboard-payments.html" },
    { page: "investments", label: "Investments", icon: "fa-chart-line", href: "dashboard-investments.html" },
    { page: "loans", label: "Loans", icon: "fa-hand-holding-dollar", href: "dashboard-loans.html" },
    { page: "cards", label: "Cards", icon: "fa-credit-card", href: "cards.html" },
    { page: "profile", label: "Profile", icon: "fa-user", href: "profile.html" },
  ];

  const PAGE_TITLES = {
    overview: "Overview", accounts: "My Accounts", transactions: "Transactions",
    payments: "Payments", investments: "Investments", loans: "Loans",
    cards: "Cards", profile: "Profile",
  };

  /* ---------- shared transaction dataset ---------- */
  const TXN_DATA = [
    { iso: "2026-09-12", desc: "Netflix Subscription", cat: "Bills", amount: -14.99, status: "Completed" },
    { iso: "2026-09-11", desc: "Salary Credit", cat: "Income", amount: 4800, status: "Completed" },
    { iso: "2026-09-10", desc: "Grocery Store", cat: "Food", amount: -86.4, status: "Completed" },
    { iso: "2026-09-09", desc: "Online Shopping", cat: "Shopping", amount: -120.0, status: "Pending" },
    { iso: "2026-09-08", desc: "Flight Booking", cat: "Travel", amount: -340.0, status: "Completed" },
    { iso: "2026-09-07", desc: "Movie Tickets", cat: "Entertainment", amount: -24.0, status: "Completed" },
    { iso: "2026-09-06", desc: "Electricity Bill", cat: "Bills", amount: -98.2, status: "Completed" },
    { iso: "2026-09-05", desc: "Amazon Purchase", cat: "Shopping", amount: -64.9, status: "Failed" },
    { iso: "2026-09-04", desc: "Restaurant Dinner", cat: "Food", amount: -52.0, status: "Completed" },
    { iso: "2026-09-03", desc: "Uber Ride", cat: "Travel", amount: -18.5, status: "Completed" },
    { iso: "2026-09-02", desc: "Freelance Income", cat: "Income", amount: 900, status: "Completed" },
    { iso: "2026-09-01", desc: "Spotify Subscription", cat: "Entertainment", amount: -9.99, status: "Pending" },
  ];

  const fmtDate = (iso) => {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };
  const badgeCls = { Completed: "success", Pending: "warning", Failed: "danger" };

  function txnRow(t, idx) {
    const cls = t.amount < 0 ? "amount-out" : "amount-in";
    const sign = t.amount < 0 ? "−" : "+";
    const b = badgeCls[t.status] || "info";
    return `<tr>
      <td>${fmtDate(t.iso)}</td>
      <td><b>${t.desc}</b></td>
      <td><span class="badge badge-info">${t.cat}</span></td>
      <td><span class="${cls}">${sign}$${Math.abs(t.amount).toFixed(2)}</span></td>
      <td><span class="badge badge-${b}"><i class="fa-solid fa-circle"></i> ${t.status}</span></td>
    </tr>`;
  }

  /* ============ ACCESS GUARD ============ */
  function checkDashboardAccess() {
    if (!authAPI.checkLogin()) window.location.href = "login.html";
  }

  /* ============ SHELL ============ */
  function renderDashboardShell() {
    const root = $("#dashShell");
    if (!root) return;
    /* dashboard.html is a verified-login landing page that forwards to
       overview.html — do not paint the shell here. */
    if (document.body.dataset.forward) return;
    const page = document.body.dataset.page || "overview";
    const title = PAGE_TITLES[page] || "Dashboard";

    const menu = DASH_PAGES.map((p) =>
      `<a href="${p.href}" class="dash-nav-item ${p.page === page ? "active" : ""}" data-dash="${p.page}">
         <i class="fa-solid ${p.icon}"></i>${p.label}
       </a>`).join("");

    root.innerHTML = `
      <div class="dash-overlay"></div>
      <aside class="dash-sidebar">
        <button class="dash-sidebar-close" type="button" aria-label="Close dashboard menu"><i class="fa-solid fa-xmark"></i></button>
        <a href="index.html" class="dash-logo" aria-label="Stackly home"><img class="brand-logo" src="stackly/assets/icons/images/Stackly_logo.png" alt="Stackly logo"></a>
        <nav class="dash-nav" aria-label="Dashboard">${menu}</nav>
        <div class="dash-cta">
          <b>Need help?</b>
          <p>Our support team is available 24/7.</p>
          <button type="button" class="btn btn-sm support-btn" data-support style="background:var(--grad-primary);color:#fff;width:100%">Contact Support</button>
        </div>
      </aside>

      <header class="dash-header">
        <div class="dash-h-left">
          <button class="dash-toggle" type="button" aria-label="Open dashboard menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
          <h2 class="dash-h-title">${title}</h2>
        </div>
        <div class="dash-h-right">
          <div class="user-chip">
            <span class="avatar user-avatar"></span>
            <span><b class="uc-name user-name"></b><span class="uc-sub user-email"></span></span>
          </div>
          <button class="logout-btn" data-logout><i class="fa-solid fa-arrow-right-from-bracket"></i><span>Logout</span></button>
        </div>
      </header>

      <div class="modal-overlay" id="logoutModal">
        <div class="modal warn">
          <div class="modal-icon"><i class="fa-solid fa-right-from-bracket"></i></div>
          <h3>Are you sure you want to logout?</h3>
          <p>You will need to log in again to access your dashboard.</p>
          <div class="modal-actions">
            <button class="btn btn-ghost" data-cancel-logout>Cancel</button>
            <button class="btn btn-danger" data-confirm-logout>Confirm Logout</button>
          </div>
        </div>
      </div>`;

    authAPI.displayUserName();

    $(".dash-overlay").addEventListener("click", () => {
      document.body.classList.remove("sidebar-open");
      $(".dash-overlay").classList.remove("show");
      $(".dash-toggle").setAttribute("aria-expanded", "false");
      $(".dash-toggle").innerHTML = '<i class="fa-solid fa-bars"></i>';
    });

    const dashToggle = $(".dash-toggle");
    const closeSidebar = () => {
      document.body.classList.remove("sidebar-open");
      $(".dash-overlay").classList.remove("show");
      dashToggle.setAttribute("aria-expanded", "false");
      dashToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    };
    $(".dash-sidebar-close").addEventListener("click", closeSidebar);
    dashToggle.addEventListener("click", () => {
      const open = !document.body.classList.contains("sidebar-open");
      document.body.classList.toggle("sidebar-open", open);
      $(".dash-overlay").classList.toggle("show", open);
      dashToggle.setAttribute("aria-expanded", String(open));
      dashToggle.innerHTML = open
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });
    $$(".dash-nav-item").forEach((item) => item.addEventListener("click", () => {
      closeSidebar();
    }));

    const support = $("[data-support]");
    if (support) support.addEventListener("click", () => {
      showToast("Support request received", "Our customer team will call you back shortly.", "success");
    });

    /* logout modal */
    const modal = $("#logoutModal");
    $("[data-logout]").addEventListener("click", () => modal.classList.add("show"));
    $("[data-cancel-logout]").addEventListener("click", () => modal.classList.remove("show"));
    $("[data-confirm-logout]").addEventListener("click", () => {
      modal.classList.remove("show");
      authAPI.logoutUser();
      showToast("Logged out successfully.", "See you soon!", "info");
      setTimeout(() => (window.location.href = "login.html"), 1200);
    });
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("show"); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") modal.classList.remove("show"); });
  }

  /* ============ OVERVIEW ============ */
  function initOverview() {
    registerPie("overviewPie", [420, 310, 260, 180, 120],
      ["#2742f5", "#7c3aed", "#22d3ee", "#f472b6", "#f59e0b"], { hole: true, holeColor: "#ffffff" });

    const tbody = $("#overviewTxn");
    if (tbody) tbody.innerHTML = TXN_DATA.slice(0, 5).map(txnRow).join("");
  }

  /* ============ ACCOUNTS ============ */
  function initAccounts() {
    $$(".mask-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".acct-card");
        const full = card.querySelector(".acct-num .full");
        const masked = card.querySelector(".acct-num .masked");
        if (full && masked) {
          const show = full.hasAttribute("hidden");
          full.toggleAttribute("hidden", !show);
          masked.toggleAttribute("hidden", show);
          btn.innerHTML = show ? '<i class="fa-solid fa-eye-slash"></i> Hide' : '<i class="fa-solid fa-eye"></i> Reveal';
        }
      });
    });
  }

  /* ============ TRANSACTIONS (filtering) ============ */
  function initTransactions() {
    const tbody = $("#txnTbody");
    if (!tbody) return;
    const search = $("#txnSearch"), date = $("#txnDate"), cat = $("#txnCat");
    const counts = { in: $("#incomeTotal"), out: $("#expenseTotal"), all: $("#txnCount") };

    function render() {
      const q = (search.value || "").toLowerCase();
      const c = cat.value;
      const d = date.value;
      let rows = TXN_DATA.filter((t) => {
        if (c && t.cat !== c) return false;
        if (d && t.iso !== d) return false;
        if (q && !(t.desc.toLowerCase().includes(q) || t.status.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q))) return false;
        return true;
      });
      const income = rows.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0);
      const expense = rows.filter((t) => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0);
      if (counts.in) counts.in.textContent = "+$" + income.toFixed(2);
      if (counts.out) counts.out.textContent = "−$" + expense.toFixed(2);
      if (counts.all) counts.all.textContent = rows.length + " transaction" + (rows.length === 1 ? "" : "s");
      tbody.innerHTML = rows.length ? rows.map(txnRow).join("")
        : `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:2rem">No transactions match your filters.</td></tr>`;
    }
    [search, date, cat].forEach((f) => f && f.addEventListener("input", render));
    render();
  }

  /* ============ DASHBOARD PAYMENTS ============ */
  function initPayments() {
    const form = $("#sendMoneyForm");
    if (!form) return;
    const history = $("#payHistory");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#payName").value.trim();
      const upi = $("#payUpi").value.trim();
      const amount = parseFloat($("#payAmount").value);
      const method = $("#payMethod").value;
      let ok = true;
      if (!name) { markInvalid("#payName"); ok = false; }
      if (!/^[\w.\-]+@[\w.\-]+$/.test(upi)) { markInvalid("#payUpi"); ok = false; }
      if (!(amount > 0)) { markInvalid("#payAmount"); ok = false; }
      if (!ok) { showToast("Invalid details", "Please check the recipient details.", "error"); return; }

      if (history) {
        const el = document.createElement("div");
        el.className = "tx-card";
        el.style.animation = "toastIn 0.5s ease both";
        el.innerHTML =
          `<div class="tx-icon" style="background:linear-gradient(135deg,#2742f5,#7c3aed)"><i class="fa-solid fa-money-bill-transfer"></i></div>
           <div class="tx-meta"><b>${name}</b><span>${upi} · ${method}</span></div>
           <span class="tx-amount amount-out">−$${amount.toFixed(2)}</span>`;
        history.prepend(el);
      }
      form.reset();
      showToast("Payment Successful!", "Money sent to " + name + ".", "success");
    });
    $$("#sendMoneyForm .form-control").forEach((f) => f.addEventListener("input", () => f.classList.remove("invalid")));
  }

  /* ============ DASHBOARD INVESTMENTS ============ */
  function initInvestments() {
    registerPie("dashInvestPie", [45, 25, 15, 10, 5],
      ["#2742f5", "#7c3aed", "#22d3ee", "#f59e0b", "#f472b6"], { hole: true, holeColor: "#ffffff" });
  }

  /* ============ DASHBOARD LOANS ============ */
  function initLoans() {
    $$(".loan-progress").forEach((p) => {
      const val = parseFloat(p.dataset.value || "0");
      setTimeout(() => { const bar = p.querySelector("i"); if (bar) bar.style.width = val + "%"; }, 300);
    });
  }

  /* ============ CARDS (freeze / unfreeze / details) ============ */
  function initCards() {
    $$(".card-shell").forEach((shell) => {
      const statusEl = shell.querySelector(".card-status");
      const title = (shell.querySelector(".card-title") || {}).textContent || "Card";
      const fullNum = shell.querySelector(".bc-num .full");
      const maskedNum = shell.querySelector(".bc-num .masked");

      shell.querySelectorAll("[data-action]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const action = btn.dataset.action;
          if (action === "freeze") {
            shell.classList.add("frozen");
            statusEl.className = "card-status off";
            statusEl.innerHTML = '<i class="fa-solid fa-snowflake"></i> Frozen';
            showToast("Card frozen", title + " is now frozen temporarily.", "info");
          } else if (action === "unfreeze") {
            shell.classList.remove("frozen");
            statusEl.className = "card-status on";
            statusEl.innerHTML = '<i class="fa-solid fa-check"></i> Active';
            showToast("Card active", title + " is ready to use again.", "success");
          } else if (action === "details") {
            if (fullNum && maskedNum) {
              const show = fullNum.hasAttribute("hidden");
              fullNum.toggleAttribute("hidden", !show);
              maskedNum.toggleAttribute("hidden", show);
              btn.innerHTML = show ? '<i class="fa-solid fa-eye-slash"></i> Hide' : '<i class="fa-solid fa-eye"></i> View Details';
            }
          }
        });
      });
    });
  }

  /* ============ PROFILE ============ */
  function initProfile() {
    const user = authAPI.getCurrentUser();
    if (!user) return;
    const name = $("#profileName"), email = $("#profileEmail"), phone = $("#profilePhone");
    if (name) name.value = "";
    if (email) email.value = "";
    if (phone) phone.value = "";

    const member = $("#memberSince");
    if (member) {
      member.textContent = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
        : "September 2026";
    }

    const form = $("#profileForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const newName = name.value.trim();
        const newPhone = phone.value.trim();
        if (newName.length < 3) { markInvalid("#profileName"); showToast("Invalid", "Name must be at least 3 characters.", "error"); return; }
        const users = authAPI.getUsers();
        const idx = users.findIndex((u) => u.email === user.email);
        if (idx > -1) { users[idx].name = newName; users[idx].phone = newPhone; authAPI.saveUsers(users); }
        authAPI.displayUserName();
        showToast("Profile updated", "Your details have been saved successfully.", "success");
      });
      $$("#profileForm .form-control").forEach((f) => f.addEventListener("input", () => f.classList.remove("invalid")));
    }
  }

  /* ============ per-page dispatcher ============ */
  function initDashboardPage() {
    checkDashboardAccess();
    renderDashboardShell();
    initAnimations(); /* reveal + counters (util from main.js) */

    const page = document.body.dataset.page;
    const registry = {
      overview: initOverview,
      accounts: initAccounts,
      transactions: initTransactions,
      payments: initPayments,
      investments: initInvestments,
      loans: initLoans,
      cards: initCards,
      profile: initProfile,
    };
    if (registry[page]) registry[page]();
  }

  /* ---------- helpers reused from main.js are globals ($, $$, showToast,
     registerPie, initAnimations). markInvalid is defined in auth.js. ---------- */
  function markInvalid(selector) {
    const el = $(selector);
    if (el) el.classList.add("invalid");
  }

  document.addEventListener("DOMContentLoaded", initDashboardPage);
})();
