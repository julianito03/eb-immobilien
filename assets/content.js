// Renders CMS-managed content (listings, about, contact details) from
// /content/*.json into the pages. Progressive enhancement: the static HTML
// stays as a fallback; these functions only override it once JSON has loaded.
(function () {
  "use strict";

  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  async function load(path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) { return null; }
  }

  const lang = () => (window.EBLang && window.EBLang.current) || "de";
  // pick a localised field: base + "_" + lang, falling back to _de then base
  const pick = (o, base) => o[base + "_" + lang()] || o[base + "_de"] || o[base] || "";

  const STATUS = {
    available: { de: "Verfügbar", en: "Available", cls: "is-available" },
    reserved: { de: "Reserviert", en: "Reserved", cls: "is-reserved" },
    sold: { de: "Verkauft", en: "Sold", cls: "is-sold" },
  };

  const DATA = { listings: null, about: null, site: null };
  let filter = "all";

  // ── Listings ────────────────────────────────────────────────────
  function listingCard(it) {
    const st = STATUS[it.status] || STATUS.available;
    const specs = [];
    if (it.rooms) specs.push(lang() === "en" ? it.rooms + " rooms" : it.rooms + " Zimmer");
    if (it.area) specs.push(it.area);
    if (it.extra || it.extra_de) specs.push(pick(it, "extra"));
    const price = it.price ? esc(it.price) : (lang() === "en" ? "Price on request" : "Preis auf Anfrage");
    const img = it.image ? esc(it.image) : "assets/img/placeholder-listing.svg";
    const detail = lang() === "en" ? "Details →" : "Details →";
    const type = pick(it, "type");
    return `
    <article class="listing reveal in">
      <div class="listing-photo">
        <span class="listing-badge ${st.cls}">${esc(st[lang()])}</span>
        ${type ? `<span class="listing-type">${esc(type)}</span>` : ""}
        <img src="${img}" alt="${esc(pick(it, "title"))}" loading="lazy">
      </div>
      <div class="listing-body">
        <div class="listing-loc">${esc(it.location || "")}</div>
        <h3>${esc(pick(it, "title"))}</h3>
        <p>${esc(pick(it, "desc"))}</p>
        ${specs.length ? `<div class="listing-specs">${specs.map((s) => `<span class="spec">${esc(s)}</span>`).join("")}</div>` : ""}
        <div class="listing-foot">
          <span class="listing-price">${price}</span>
          <a class="more" href="kontakt.html">${detail}</a>
        </div>
      </div>
    </article>`;
  }

  function renderInto(mount, items) {
    if (!items.length) {
      mount.innerHTML = `<p class="listings-empty">${
        lang() === "en"
          ? "No properties listed right now. Please get in touch — new objects are added regularly."
          : "Aktuell sind keine Objekte gelistet. Sprechen Sie mich gern an – neue Objekte kommen regelmäßig dazu."
      }</p>`;
      return;
    }
    mount.innerHTML = items.map(listingCard).join("");
  }

  function items() { return (DATA.listings && DATA.listings.items) || []; }

  function renderFeatured() {
    const m = document.getElementById("featured-listings");
    if (!m) return;
    renderInto(m, items().filter((it) => it.status !== "sold").slice(0, 3));
  }

  function applyFilter() {
    const grid = document.getElementById("listing-grid");
    if (!grid) return;
    const list = items().filter((it) => {
      if (filter === "all") return true;
      if (filter === "sold") return it.status === "sold";
      return (it.category || "kauf") === filter;
    });
    renderInto(grid, list);
  }

  // ── About ───────────────────────────────────────────────────────
  function renderAbout() {
    const d = DATA.about;
    if (!d) return;
    const bio = document.getElementById("about-bio");
    if (bio) {
      const v = (lang() === "en" ? d.bio_en : d.bio_de) || d.bio_de || "";
      bio.innerHTML = String(v).split(/\n\n+/).map((p) => `<p>${esc(p.trim())}</p>`).join("");
    }
    document.querySelectorAll('[data-eb-about="photo"]').forEach((img) => { if (d.photo) img.setAttribute("src", d.photo); });
    document.querySelectorAll('[data-eb-about="name"]').forEach((el) => { if (d.name) el.textContent = d.name; });
    document.querySelectorAll('[data-eb-about="role"]').forEach((el) => {
      const r = (lang() === "en" ? d.role_en : d.role_de); if (r) el.textContent = r;
    });
  }

  // ── Site / contact details ──────────────────────────────────────
  function bindSite() {
    const d = DATA.site;
    if (!d) return;
    window.EBSite = d;
    const set = (key) => document.querySelectorAll(`[data-eb="${key}"]`).forEach((el) => {
      const v = d[key];
      if (!v) return;
      if (key === "address") el.innerHTML = esc(v).replace(/,\s*/g, "<br>");
      else el.textContent = v;
      if (el.tagName === "A") {
        if (key === "email") el.setAttribute("href", "mailto:" + v);
        else el.setAttribute("href", "tel:" + String(v).replace(/[^\d+]/g, ""));
      }
    });
    ["email", "phone", "office_phone", "address"].forEach(set);
    if (d.images) Object.keys(d.images).forEach((k) => {
      const v = d.images[k];
      if (!v) return;
      const abs = new URL(v, location.href).href; // absolute → avoids CSS var() relative-to-stylesheet resolution
      document.querySelectorAll(`[data-eb-bg="${k}"]`).forEach((el) => el.style.setProperty("--ph", `url('${abs}')`));
      document.querySelectorAll(`[data-eb-img="${k}"]`).forEach((el) => el.setAttribute("src", v));
    });
  }

  function renderAll() { renderFeatured(); applyFilter(); renderAbout(); }

  async function init() {
    const [listings, about, site] = await Promise.all([
      load("content/listings.json"),
      load("content/about.json"),
      load("content/site.json"),
    ]);
    DATA.listings = listings; DATA.about = about; DATA.site = site;
    bindSite();

    document.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        filter = btn.getAttribute("data-filter");
        document.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("active", b === btn));
        applyFilter();
      });
    });

    renderAll();
    if (window.EBLang) window.EBLang.onChange(renderAll);
  }

  init();
})();
