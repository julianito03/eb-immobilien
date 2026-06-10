// Lightweight bilingual engine (DE default / EN).
// Translations live co-located in the markup:
//   <span data-en="Home">Start</span>            -> textContent swap
//   <h1 data-en-html="Sell<br>with ...">..</h1>   -> innerHTML swap (allows <br>)
//   <input data-en-ph="Your name" placeholder="Ihr Name">  -> placeholder swap
// German is the static fallback; English is supplied via the data-en* attribute.
(function () {
  "use strict";
  const KEY = "eb_lang";
  const listeners = [];

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  let lang = stored() === "en" ? "en" : "de";

  function snapshot(root) {
    root.querySelectorAll("[data-en]").forEach((el) => {
      if (!el.hasAttribute("data-de")) el.setAttribute("data-de", el.textContent);
    });
    root.querySelectorAll("[data-en-html]").forEach((el) => {
      if (!el.hasAttribute("data-de-html")) el.setAttribute("data-de-html", el.innerHTML);
    });
    root.querySelectorAll("[data-en-ph]").forEach((el) => {
      if (!el.hasAttribute("data-de-ph")) el.setAttribute("data-de-ph", el.getAttribute("placeholder") || "");
    });
  }

  function applyTo(root) {
    snapshot(root);
    root.querySelectorAll("[data-en]").forEach((el) => {
      const v = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-de");
      if (v != null) el.textContent = v;
    });
    root.querySelectorAll("[data-en-html]").forEach((el) => {
      const v = lang === "en" ? el.getAttribute("data-en-html") : el.getAttribute("data-de-html");
      if (v != null) el.innerHTML = v;
    });
    root.querySelectorAll("[data-en-ph]").forEach((el) => {
      const v = lang === "en" ? el.getAttribute("data-en-ph") : el.getAttribute("data-de-ph");
      if (v != null) el.setAttribute("placeholder", v);
    });
  }

  const EBLang = {
    get current() { return lang; },
    apply(root) { applyTo(root || document); },
    set(l) {
      lang = l === "en" ? "en" : "de";
      try { localStorage.setItem(KEY, lang); } catch (e) {}
      document.documentElement.setAttribute("lang", lang);
      applyTo(document);
      document.querySelectorAll(".lang-toggle button").forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-lang") === lang);
      });
      listeners.forEach((fn) => { try { fn(lang); } catch (e) {} });
    },
    onChange(fn) { listeners.push(fn); },
  };
  window.EBLang = EBLang;

  // Apply to whatever static content exists at load time.
  document.documentElement.setAttribute("lang", lang);
  applyTo(document);
})();
