/* Fit the whole widget into its embed; never enlarge its type or icons. */
(() => {
  'use strict';
  function start() {
    document.querySelectorAll('[data-fit-viewport]').forEach(viewport => {
      const content = viewport.querySelector('[data-fit-content]');
      if (!content) return;
      const minimum = Number(content.dataset.fitMinWidth);
      // Fluid spacing is opt-in. Finished widgets keep their existing width cap.
      const fillWidth = content.hasAttribute('data-fit-fill-width');
      const maximum = fillWidth ? Infinity : Number(content.dataset.fitMaxWidth);
      if (!(minimum > 0 && maximum >= minimum)) return;
      let pending = 0;
      let measuredWidth = 0;
      let measuredHeight = 0;
      function fit() {
        if (pending) cancelAnimationFrame(pending);
        pending = 0;
        const frame = viewport.getBoundingClientRect();
        const style = getComputedStyle(viewport);
        const left = parseFloat(style.paddingLeft) || 0;
        const right = parseFloat(style.paddingRight) || 0;
        const top = parseFloat(style.paddingTop) || 0;
        const bottom = parseFloat(style.paddingBottom) || 0;
        const width = Math.max(0, frame.width - left - right);
        const height = Math.max(0, frame.height - top - bottom);
        if (!width || !height) return;

        let layoutWidth = Math.max(minimum, Math.min(maximum, width));
        let naturalWidth = 0;
        let naturalHeight = 0;
        let scale = 1;
        // A short frame can reduce the composition. Fluid weather compensates
        // with more space BETWEEN its fixed-size groups, still filling the width.
        for (let pass = 0; pass < (fillWidth ? 3 : 1); pass++) {
          const cssWidth = `${layoutWidth}px`;
          if (content.style.width !== cssWidth) content.style.width = cssWidth;
          naturalWidth = Math.max(content.offsetWidth, content.scrollWidth);
          naturalHeight = Math.max(content.offsetHeight, content.scrollHeight);
          if (!naturalWidth || !naturalHeight) return;
          scale = Math.min(1, width / naturalWidth, height / naturalHeight);
          if (!fillWidth || Math.abs(naturalWidth * scale - width) < .5) break;
          layoutWidth = Math.max(minimum, width / scale);
        }
        if (!naturalWidth || !naturalHeight) return;
        measuredWidth = naturalWidth;
        measuredHeight = naturalHeight;
        // A short or narrow frame reduces the entire composition, not individual parts.
        content.style.left = `${left + width / 2}px`;
        content.style.top = `${top + height / 2}px`;
        content.style.transform = `translate(-50%, -50%) scale(${scale})`;
        content.dataset.fitScale = String(scale);
        content.dataset.fitWidth = String(naturalWidth);
        content.dataset.fitHeight = String(naturalHeight);
        content.dataset.fitReady = 'true';
      }
      function schedule() {
        if (!pending) pending = requestAnimationFrame(fit);
      }
      // Resize before paint, rather than showing one frame at the previous scale.
      const frameObserver = new ResizeObserver(fit);
      frameObserver.observe(viewport);
      const contentObserver = new ResizeObserver(() => {
        if (Math.max(content.offsetWidth, content.scrollWidth) !== measuredWidth
          || Math.max(content.offsetHeight, content.scrollHeight) !== measuredHeight) fit();
      });
      contentObserver.observe(content);
      addEventListener('resize', fit, {passive: true});
      document.fonts?.ready.then(schedule);
      fit();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
