import { LIMIT, configuration, persistence, change, fraction, decode } from './model.mjs';
import { FEEDBACK_DURATION, feedbackAnchors, flightFrames } from './motion.mjs?rev=compact-fit-local-1';

const config = configuration(document.body.dataset.goal, location.search);
let storage;
try { storage = window.localStorage; } catch { /* In-memory mode is supported. */ }
const store = persistence(storage, config.key);
let state = store.read();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const params = new URLSearchParams(location.search);
if (['dark', 'light'].includes(params.get('preview'))) document.documentElement.dataset.preview = params.get('preview');
document.title = config.title;
document.documentElement.lang = 'ru';

// Symbols are from Heroicons (MIT), obtained from their upstream repository.
const symbols = {
  plus: '<path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>',
  minus: '<path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>',
  reset: '<path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>',
};
const svg = name => `<svg viewBox="0 0 20 20" aria-hidden="true">${symbols[name]}</svg>`;
const mount = document.querySelector('main');
mount.innerHTML = `<article class="goal" data-type="${config.type}" aria-labelledby="goal-title">
  <div class="surface" aria-hidden="true"><div class="fill"></div></div><div class="inner-edge" aria-hidden="true"></div>
  <div class="row">
    <div class="icon-tile" aria-hidden="true"><img width="32" height="32" alt=""></div>
    <div class="copy"><output class="counter"></output><h1 class="title" id="goal-title"></h1></div>
    <div class="controls"><button class="control minus" type="button" aria-label="Уменьшить на ${config.step}" title="Уменьшить">${svg('minus')}</button>
    <button class="control plus" type="button" aria-label="Добавить ${config.step}" title="Добавить">${svg('plus')}</button></div>
  </div>
  <div class="feedback-layer" aria-hidden="true"></div><span class="sr-only" role="status" aria-live="polite"></span>
</article>`;
const card = mount.querySelector('.goal');
const counter = card.querySelector('.counter');
const title = card.querySelector('.title');
const plus = card.querySelector('.plus');
const minus = card.querySelector('.minus');
const layer = card.querySelector('.feedback-layer');
const status = card.querySelector('[role=status]');
reducedMotion.addEventListener('change', event => {
  if (event.matches) {
    for (const animation of card.getAnimations({ subtree: true })) animation.cancel();
    layer.replaceChildren();
  }
});
card.querySelector('img').src = new URL(`./assets/${config.icon}`, import.meta.url).href;
title.textContent = config.title;

function render(announce = false) {
  counter.textContent = `${state.count}/${config.goal}`;
  card.style.setProperty('--progress', fraction(state.count, config.goal));
  card.dataset.count = state.count;
  minus.disabled = state.count === 0;
  plus.disabled = state.count === LIMIT;
  if (announce) status.textContent = `${config.title}: ${state.count} из ${config.goal}`;
}

// Fit real wrapped text when the embed becomes very short. The outer card and
// progress surface always occupy the complete frame and never scale or scroll.
function fitCopy() {
  card.style.setProperty('--type-scale', 1);
  const row = card.querySelector('.row');
  const copy = card.querySelector('.copy');
  const style = getComputedStyle(row);
  const available = Math.max(1, row.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom));
  let scale = 1;
  for (let attempt = 0; attempt < 3 && copy.scrollHeight > available + .5; attempt++) {
    scale *= available / copy.scrollHeight;
    card.style.setProperty('--type-scale', Math.max(.05, scale));
  }
}
const resizeObserver = new ResizeObserver(fitCopy);
resizeObserver.observe(mount);
document.fonts.ready.then(fitCopy);

function buttonFeedback(button) {
  if (reducedMotion.matches) return;
  button.getAnimations().forEach(animation => animation.cancel());
  button.animate([
    { transform: 'scale(1)' }, { transform: 'scale(.68)', offset: .24 },
    { transform: 'scale(1.03)', offset: .8 }, { transform: 'scale(1)' },
  ], { duration: 180, easing: 'ease-out' });
}

function positiveFeedback(amount) {
  const origin = feedbackAnchors(layer.getBoundingClientRect(), plus.parentElement.getBoundingClientRect(), {
    left: plus.offsetLeft, top: plus.offsetTop, width: plus.offsetWidth,
  });
  const node = document.createElement('span');
  node.className = 'feedback';
  node.textContent = `+${amount}`;
  node.style.left = `${origin.x}px`;
  node.style.top = `${origin.y}px`;
  // Every click has its own node/animation; a rapid second click never cancels the first.
  layer.append(node);
  const bounds = layer.getBoundingClientRect();
  const text = node.getBoundingClientRect();
  const frames = flightFrames(origin.travelX, {
    width: bounds.width, height: bounds.height, startX: origin.x, startY: origin.y,
    textWidth: text.width, textHeight: text.height,
  });
  const animation = node.animate(reducedMotion.matches ? [
    { transform: frames[0].transform, opacity: 1 }, { transform: frames[0].transform, opacity: 0 },
  ] : frames, {
    duration: reducedMotion.matches ? 150 : FEEDBACK_DURATION, easing: 'linear',
  });
  const cleanup = () => node.remove();
  animation.onfinish = cleanup;
  animation.oncancel = cleanup;
}

function update(delta, button) {
  const previous = state;
  state = change(state, delta);
  if (state === previous) return;
  store.write(state);
  render(true);
  buttonFeedback(button);
  if (delta > 0) positiveFeedback(state.count - previous.count);
}
plus.addEventListener('click', () => update(config.step, plus));
minus.addEventListener('click', () => update(-config.step, minus));
window.addEventListener('storage', event => {
  if (event.key !== config.key || event.storageArea !== storage) return;
  state = decode(event.newValue);
  render(true);
});
render();
fitCopy();
