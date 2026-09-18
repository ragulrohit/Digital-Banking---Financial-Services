/* ============================================================
   STACKLY — auth.js
   localStorage based authentication for the frontend demo.
   Exposes: signupUser, loginUser, checkLogin, logoutUser,
   getCurrentUser, displayUserName, displayUserEmail.
   ============================================================ */
(function () {
  "use strict";

  const LS_USERS = "stackly_users";
  const LS_CURRENT = "stackly_current";
  const LS_REMEMBER = "stackly_remember";

  /* ---------- storage helpers ---------- */
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(LS_USERS)) || []; } catch (e) { return []; }
  }
  function saveUsers(list) { localStorage.setItem(LS_USERS, JSON.stringify(list)); }

  /* ---------- demo user ----------
     Seeds a ready-made account so the login demo works instantly.
     Users can still sign up normally — the demo row is only added once. */
  function seedDemoUser() {
    const users = getUsers();
    if (!users.some((u) => u.email === "demo@stackly.com")) {
      users.push({
        name: "Demo User",
        email: "demo@stackly.com",
        phone: "+1 555 010 2040",
        password: "Demo1234",
        createdAt: new Date().toISOString(),
      });
      saveUsers(users);
    }
  }

  /* ---------- session ---------- */
  function storeCurrent(email) { localStorage.setItem(LS_CURRENT, email); sessionStorage.setItem(LS_CURRENT, email); }

  function checkLogin() {
    return localStorage.getItem(LS_CURRENT) || sessionStorage.getItem(LS_CURRENT) || null;
  }

  function logoutUser() {
    localStorage.removeItem(LS_CURRENT);
    sessionStorage.removeItem(LS_CURRENT);
    localStorage.removeItem(LS_REMEMBER);
  }

  function getCurrentUser() {
    const email = checkLogin();
    if (!email) return null;
    return getUsers().find((u) => u.email === email) || null;
  }

  /* ---------- derive a readable display name from an email ----------
     jeeva@gmail.com   -> "Jeeva"
     john.doe@gmail.com -> "John Doe"                                      */
  function extractName(email) {
    if (!email) return "User";
    const local = email.split("@")[0];
    const words = local.split(/[._\-]+/).filter(Boolean);
    if (!words.length) words.push("User");
    return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }

  /* ---------- signup ---------- */
  function signupUser(user) {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
      return { ok: false, message: "An account with this email already exists." };
    }
    users.push({
      name: user.name.trim(),
      email: user.email.trim().toLowerCase(),
      phone: user.phone.trim(),
      role: user.role,
      password: user.password,
      createdAt: new Date().toISOString(),
    });
    saveUsers(users);
    return { ok: true, message: "Account Created Successfully!" };
  }

  /* ---------- login ---------- */
  function loginUser(creds) {
    const email = creds.email.trim().toLowerCase();
    const users = getUsers();
    let found = users.find((u) => u.email === email);
    if (!found) {
      found = {
        name: extractName(email), email, phone: "", role: creds.role || "personal",
        password: creds.password, createdAt: new Date().toISOString(),
      };
      users.push(found);
      saveUsers(users);
    }
    storeCurrent(email);
    if (creds.remember) localStorage.setItem(LS_REMEMBER, "1");
    return { ok: true, message: "Login Successful! Welcome back." };
  }

  /* ---------- display helpers ---------- */
  function displayUserName() {
    const user = getCurrentUser();
    if (!user) return;
    const display =
      (user.name && user.name.trim())
        ? user.name.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
        : extractName(user.email);

    /* fill every element marked for the user name / email */
    document.querySelectorAll(".user-name").forEach((el) => { el.textContent = display; });
    document.querySelectorAll(".user-email").forEach((el) => { el.textContent = user.email; });

    /* avatar initials from the display name */
    const initials = display.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    document.querySelectorAll(".user-avatar").forEach((el) => { el.textContent = initials; });

    /* welcome banner inside dashboards */
    document.querySelectorAll(".dash-welcome h1").forEach((el) => {
      el.innerHTML = 'Welcome back, <span class="grad-text">' + display + "</span>";
    });
  }

  function displayUserEmail() {
    const user = getCurrentUser();
    document.querySelectorAll(".user-email").forEach((el) => { el.textContent = user ? user.email : ""; });
  }

  /* ============ LOGIN PAGE ============ */
  function initLoginPage() {
    const form = $("#loginForm");
    if (!form) return;

    const toggle = $("#togglePassword");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const input = $("#loginPassword");
        const icon = toggle.querySelector("i");
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        icon.className = show ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#loginEmail").value.trim();
      const password = $("#loginPassword").value;
      const remember = $("#rememberMe").checked;
      const role = $("#loginRole").value;
      let ok = true;

      if (!role) { markInvalid("#loginRole"); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { markInvalid("#loginEmail"); ok = false; }
      if (!password) { markInvalid("#loginPassword"); ok = false; }
      if (!ok) { showToast("Invalid input", "Enter a valid email and password.", "error"); return; }

      const res = loginUser({ email, password, role, remember });
      if (!res.ok) { showToast("Login failed", res.message, "error"); return; }

      /* success screen, then redirect to dashboard */
      const box = document.querySelector(".auth-box");
      if (box) {
        box.innerHTML =
          '<div class="auth-succ">' +
          '<div class="auth-succ-icon"><i class="fa-solid fa-circle-check"></i></div>' +
          "<h2>Login Successful! Welcome back.</h2>" +
          "<p>Redirecting you to your dashboard...</p>" +
          "</div>";
      }
      showToast("Login Successful!", "Welcome back. Redirecting to dashboard.", "success");
      setTimeout(() => (window.location.href = "dashboard.html"), 1600);
    });

    $$("#loginForm .form-control").forEach((f) => f.addEventListener("input", () => f.classList.remove("invalid")));
    $("#loginRole").addEventListener("change", () => $("#loginRole").classList.remove("invalid"));
  }

  /* ============ PASSWORD STRENGTH ============ */
  function passwordScore(pw) {
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return Math.min(s, 4);
  }

  /* ============ SIGNUP PAGE ============ */
  function initSignupPage() {
    const form = $("#signupForm");
    if (!form) return;

    const toggle = $("#toggleSignupPassword");
    if (toggle) {
      toggle.addEventListener("click", () => {
        const input = $("#signupPassword");
        const icon = toggle.querySelector("i");
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        icon.className = show ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
      });
    }

    const confirmToggle = $("#toggleSignupConfirm");
    if (confirmToggle) {
      confirmToggle.addEventListener("click", () => {
        const input = $("#signupConfirm");
        const icon = confirmToggle.querySelector("i");
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        icon.className = show ? "fa-regular fa-eye-slash" : "fa-regular fa-eye";
      });
    }

    $("#signupPassword").addEventListener("input", () => {
      const s = passwordScore($("#signupPassword").value);
      const labels = ["", "Weak", "Fair", "Good", "Strong"];
      const meter = $("#pwStrength");
      if (meter) meter.dataset.score = s;
      const label = $("#pwLabel");
      if (label) { label.textContent = s ? labels[s] + " password" : ""; label.dataset.score = s; }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#signupName").value.trim();
      const email = $("#signupEmail").value.trim();
      const phone = $("#signupPhone").value.trim();
      const role = $("#signupRole").value;
      const password = $("#signupPassword").value;
      const confirm = $("#signupConfirm").value;
      const terms = $("#termsCheck").checked;
      let ok = true;

      if (!role) { markInvalid("#signupRole"); ok = false; }
      if (name.length < 3) { markInvalid("#signupName"); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { markInvalid("#signupEmail"); ok = false; }
      if (!/^\+?[0-9\s-]{10,15}$/.test(phone)) { markInvalid("#signupPhone"); ok = false; }
      if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) { markInvalid("#signupPassword"); ok = false; }
      if (confirm !== password || !confirm) { markInvalid("#signupConfirm"); ok = false; }
      if (!terms) { markInvalid("#termsCheck"); showToast("Accept terms", "Please accept the Terms & Conditions to continue.", "error"); ok = false; }

      if (!ok) { showToast("Invalid input", "Please fix the highlighted fields.", "error"); return; }

      const res = signupUser({ name, email, phone, password, role });
      if (!res.ok) { showToast("Signup failed", res.message, "error"); return; }

      showToast("Account Created Successfully!", "Redirecting to login page.", "success");
      setTimeout(() => (window.location.href = "login.html"), 1500);
    });

    $$("#signupForm .form-control").forEach((f) => f.addEventListener("input", () => f.classList.remove("invalid")));
    $("#signupRole").addEventListener("change", () => $("#signupRole").classList.remove("invalid"));
    $("#termsCheck").addEventListener("change", () => $("#termsCheck").classList.remove("invalid"));
  }

  /* ---------- inline validation helper ---------- */
  function markInvalid(selector) {
    const el = $(selector);
    if (!el) return;
    el.classList.add("invalid");
    if (!el.value) el.focus();
  }

  /* ---------- expose API + boot ---------- */
  window.authAPI = {
    getUsers, saveUsers, checkLogin, logoutUser, getCurrentUser,
    signupUser, loginUser, extractName, displayUserName, displayUserEmail, passwordScore,
    seedDemoUser,
  };

  document.addEventListener("DOMContentLoaded", () => {
    seedDemoUser();
    initLoginPage();
    initSignupPage();
    displayUserName();
  });
})();
