(() => {
  window.motionOkay = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.pad2 = (value) => String(value).padStart(2, '0');

  window.saveLocal = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  };

  window.loadLocal = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  };
})();
