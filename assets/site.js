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
    { href: "verkaufen.html", de: "Verkaufen", en: "Sell" },
    { href: "kaufen.html", de: "Kaufen & Mieten", en: "Buy & Rent" },
    { href: "bewertung.html", de: "Bewertung", en: "Valuation" },
    { href: "ueber-mich.html", de: "Über mich", en: "About" },
    { href: "kontakt.html", de: "Kontakt", en: "Contact" },
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
          <span class="brand-mark">EB</span>
          <span>EB Immobilien<small>Elida Besic · Heidelberg</small></span>
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
    const cols = [
      {
        h: "Navigation", en: "Navigation",
        items: [
          ["index.html", "Start", "Home"],
          ["immobilien.html", "Immobilien", "Properties"],
          ["ueber-mich.html", "Über mich", "About"],
          ["kontakt.html", "Kontakt", "Contact"],
        ],
      },
      {
        h: "Leistungen", en: "Services",
        items: [
          ["verkaufen.html", "Verkaufen", "Sell"],
          ["kaufen.html", "Kaufen & Mieten", "Buy & Rent"],
          ["bewertung.html", "Immobilienbewertung", "Property valuation"],
        ],
      },
      {
        h: "Rechtliches", en: "Legal",
        items: [
          ["impressum.html", "Impressum", "Imprint"],
          ["datenschutz.html", "Datenschutz", "Privacy"],
        ],
      },
    ];
    const colHtml = cols
      .map(
        (c) =>
          `<div><h4 data-en="${c.en}">${c.h}</h4><ul>${c.items
            .map((i) => `<li><a href="${i[0]}" data-en="${i[2]}">${i[1]}</a></li>`)
            .join("")}</ul></div>`
      )
      .join("");
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand"><span class="brand-mark">EB</span> EB Immobilien</div>
            <p style="font-size:.92rem;line-height:1.7;" data-eb="address">Rohrbacher Str. 68<br>69115 Heidelberg</p>
            <p style="font-size:.92rem;line-height:1.9;">
              <a href="tel:+496221914848" data-eb="office_phone">06221 914848</a><br>
              <a href="tel:+491726270270" data-eb="phone">+49 172 6270270</a><br>
              <a href="mailto:info@eb-immobilien.de" data-eb="email">info@eb-immobilien.de</a>
            </p>
          </div>
          ${colHtml}
        </div>
        <div class="footer-bottom">
          <span>© 2026 EB Immobilien · Elida Besic · <span data-en="All rights reserved.">Alle Rechte vorbehalten.</span></span>
          <span><a href="impressum.html" data-en="Imprint">Impressum</a> · <a href="datenschutz.html" data-en="Privacy">Datenschutz</a></span>
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

  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + "%";
    toTop.classList.toggle("show", h.scrollTop > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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
})();
