// Independently fitted to the visible reference's measured trajectory.
// The source application code is neither loaded nor used by this widget.
export const FEEDBACK_DURATION = 600;

export function flightState(time, travelX) {
  const t = Math.max(0, Math.min(1, time));
  const progress = (1 - Math.cos(Math.PI * t)) / 2;
  // A shallow arc: first rise 8px, then settle 10px below the emergence point.
  const y = progress <= .5
    ? -32 * progress * (1 - progress)
    : -8 + 72 * (progress - .5) ** 2;
  return { x: travelX * progress, y, scale: 1 + 2 * progress, opacity: 1 - progress };
}

export function flightFrames(travelX, bounds) {
  // Enough independent samples to preserve the measured arc with compositor animation.
  return Array.from({ length: 61 }, (_, index) => {
    const offset = index / 60;
    const state = flightState(offset, travelX);
    let { x, y, scale } = state;
    if (bounds) {
      // Keep the button-to-center flight inside a short embed instead of
      // reserving an empty strip above the card for the animation.
      const padding = 2;
      scale = Math.min(scale, Math.max(.1,
        Math.min((bounds.width - 2 * padding) / bounds.textWidth,
          (bounds.height - 2 * padding) / bounds.textHeight)));
      const halfWidth = bounds.textWidth * scale / 2;
      const halfHeight = bounds.textHeight * scale / 2;
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
      x = clamp(bounds.startX + x, halfWidth + padding, bounds.width - halfWidth - padding) - bounds.startX;
      y = clamp(bounds.startY + y, halfHeight + padding, bounds.height - halfHeight - padding) - bounds.startY;
    }
    return {
      offset,
      transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
      opacity: state.opacity,
    };
  });
}

export function feedbackAnchors(layer, controls, button) {
  // Layout offsets, not the transient scaled rectangle, keep rapid clicks at the button.
  const x = controls.left + button.left + button.width / 2 - layer.left - 2;
  const y = controls.top + button.top - layer.top - 6;
  return { x, y, travelX: layer.width / 2 + 4 - x };
}
