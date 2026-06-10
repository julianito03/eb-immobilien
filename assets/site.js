// Shared nav + footer injection and interactions for EB Immobilien.
(function () {
  // Fallback inbox for website inquiries. The real address is managed in the
  // CMS (content/site.json -> email) and overrides this once loaded.
  const INQUIRY_FALLBACK = "info@eb-immobilien.de";
  function inquiryEmail() {
    return (window.EBSite && window.EBSite.email) || INQUIRY_FALLBACK;
  }

  const NAV = [
    { href: "index.html", de: "Start", en: "Home" },
    { href: "immobilien.html", de: "Immobilien", en: "Properties" },
    { href: "leistungen.html", de: "Leistungen", en: "Services" },
    { href: "ueber-mich.html", de: "Über mich", en: "About" },
  ];

  const current = location.pathname.split("/").pop() || "index.html";
  const L = (window.EBLang && window.EBLang.current) || "de";

  function header() {
    const links = NAV.map(
      (n) =>
        `<a href="${n.href}"${n.href === current ? ' class="active"' : ""} data-en="${n.en}">${n.de}</a>`
    ).join("");
    return `
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="index.html">
          <img class="brand-logo" src="assets/img/logo-mark.png" alt="EB Immobilien" width="52" height="52">
          <span><span class="name">EB Immobilien</span><small data-en="since 1999 · Heidelberg">seit 1999 · Heidelberg</small></span>
        </a>
        <button class="nav-toggle" aria-label="Menü" aria-expanded="false"><span></span></button>
        <nav class="nav-links">
          ${links}
          <a class="nav-cta" href="kontakt.html" data-en="Get in touch">Beratung anfragen</a>
          <span class="lang-toggle" role="group" aria-label="Sprache / Language">
            <button type="button" data-lang="de"${L === "de" ? ' class="active"' : ""}>DE</button>
            <button type="button" data-lang="en"${L === "en" ? ' class="active"' : ""}>EN</button>
          </span>
        </nav>
      </div>
    </header>`;
  }

  function footer() {
    const links = [
      ["immobilien.html", "Immobilien", "Properties"],
      ["leistungen.html", "Leistungen", "Services"],
      ["ueber-mich.html", "Über mich", "About"],
      ["kontakt.html", "Kontakt", "Contact"],
      ["impressum.html", "Impressum", "Imprint"],
      ["datenschutz.html", "Datenschutz", "Privacy"],
    ].map((i) => `<a href="${i[0]}" data-en="${i[2]}">${i[1]}</a>`).join("");
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-main">
          <a class="footer-brand" href="index.html">
            <img class="brand-logo" src="assets/img/logo-mark.png" alt="EB Immobilien" width="48" height="48">
            <span><span class="name">EB Immobilien</span><small data-en="since 1999 · Heidelberg">seit 1999 · Heidelberg</small></span>
          </a>
          <nav class="footer-links">${links}</nav>
          <div class="footer-contact">
            <a href="tel:+496221914848" data-eb="office_phone">06221 914848</a>
            <a href="mailto:info@eb-immobilien.de" data-eb="email">info@eb-immobilien.de</a>
            <span data-eb="address">Rohrbacher Str. 68, 69115 Heidelberg</span>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 EB Immobilien · Elida Besic</span>
          <span data-en="Heidelberg &amp; the Rhein-Neckar region">Heidelberg &amp; Rhein-Neckar</span>
        </div>
      </div>
    </footer>`;
  }

  // Inject header / footer
  const headerMount = document.getElementById("site-header");
  const footerMount = document.getElementById("site-footer");
  if (headerMount) headerMount.innerHTML = header();
  if (footerMount) footerMount.innerHTML = footer();

  // Translate the freshly-injected chrome
  if (window.EBLang) window.EBLang.apply(document);

  // Language toggle wiring
  document.querySelectorAll(".lang-toggle button").forEach((b) => {
    b.addEventListener("click", () => {
      if (window.EBLang) window.EBLang.set(b.getAttribute("data-lang"));
    });
  });

  // Mobile toggle
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Scroll-progress bar + back-to-top
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);

  const toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Nach oben / Back to top");
  toTop.innerHTML = "↑";
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(toTop);

  const headerEl = document.querySelector(".site-header");
  let lastY = window.scrollY;
  function onScroll() {
    const h = document.documentElement;
    const y = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (y / max) * 100 : 0;
    bar.style.width = pct + "%";
    toTop.classList.toggle("show", y > 500);
    if (headerEl) {
      headerEl.classList.toggle("is-scrolled", y > 10);
      // hide when scrolling down past the hero, reveal on scroll up
      const goingDown = y > lastY && y > 240;
      const navOpen = links && links.classList.contains("open");
      headerEl.classList.toggle("is-hidden", goingDown && !navOpen);
    }
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // hero parallax-zoom kick-off once loaded
  const heroEl = document.querySelector(".hero");
  if (heroEl) requestAnimationFrame(() => heroEl.classList.add("is-ready"));

  // Animated count-up for hero stats
  function animateCount(el) {
    const raw = el.textContent.trim();
    const m = raw.match(/^(\d+)(.*)$/);
    if (!m) return;
    const target = parseInt(m[1], 10);
    const suffix = m[2] || "";
    const dur = 1100;
    let start = null;
    function step(ts) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counters = document.querySelectorAll(".hero-stats .num");
  if (counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  // Inquiry forms -> open the visitor's mail client addressed to the agency
  document.querySelectorAll("form[data-inquiry]").forEach((form) => {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const subject = (form.getAttribute("data-inquiry") || "Anfrage") + " – EB Immobilien";
      const lines = [];
      data.forEach((val, key) => { if (String(val).trim()) lines.push(key + ": " + val); });
      lines.push("", "— eb-immobilien (Website)");
      const href =
        "mailto:" + inquiryEmail() +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      const done = form.querySelector(".form-done");
      if (done) done.style.display = "block";
      window.location.href = href;
    });
  });

  // Any element with [data-inquiry-link] becomes a mailto to the agency
  document.querySelectorAll("[data-inquiry-link]").forEach((a) => {
    const subj = a.getAttribute("data-inquiry-link") || "Anfrage";
    a.setAttribute("href", "mailto:" + inquiryEmail() + "?subject=" + encodeURIComponent(subj + " – EB Immobilien"));
  });

  // Scroll reveal
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // tell the head-script watchdog that reveals are wired up (prevents a blank
  // page if this script ever fails to run)
  document.documentElement.classList.add("reveal-ready");
})();
