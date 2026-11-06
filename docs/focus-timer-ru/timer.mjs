/* MIT License. Copyright (c) 2026 Buildin reference widgets contributors. */
export const PRESETS = Object.freeze([60, 900, 1800, 3600, 7200]);

export class Countdown {
  constructor(now = () => performance.now()) {
    this.now = now;
    this.duration = 60;
    this.reset();
  }
  snapshot() {
    if (this.phase === 'running') {
      this.remainingMs = Math.max(0, this.deadline - this.now());
      if (this.remainingMs === 0) this.phase = 'done';
    }
    return { duration: this.duration, seconds: Math.ceil(this.remainingMs / 1000), phase: this.phase };
  }
  start() {
    this.snapshot();
    if (this.phase === 'running') return this.snapshot();
    if (this.remainingMs <= 0) this.remainingMs = this.duration * 1000;
    this.deadline = this.now() + this.remainingMs;
    this.phase = 'running';
    return this.snapshot();
  }
  pause() {
    this.snapshot();
    if (this.phase === 'running') this.phase = 'paused';
    return this.snapshot();
  }
  reset() {
    this.remainingMs = this.duration * 1000;
    this.deadline = null;
    this.phase = 'ready';
    return this.snapshot();
  }
  select(seconds) {
    if (!PRESETS.includes(seconds)) throw new RangeError('Unsupported timer duration');
    this.duration = seconds;
    return this.reset();
  }
}

export const formatTime = seconds => seconds <= 60 ? String(seconds)
  : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export function mountTimer(doc = document) {
  const timer = new Countdown();
  const config = new URLSearchParams(location.search);
  for (const [param, variable] of [['accent', '--accent'], ['surface', '--surface']]) {
    const color = config.get(param);
    if (color && /^#[0-9a-f]{6}$/i.test(color)) doc.querySelector('.timer').style.setProperty(variable, color);
  }
  const toggle = doc.getElementById('toggle');
  const start = doc.getElementById('start');
  const phase = doc.getElementById('phase');
  const labels = { ready: 'секунд', running: 'Фокус', paused: 'Пауза', done: 'Готово' };
  const render = () => {
    const state = timer.snapshot();
    doc.getElementById('value').textContent = formatTime(state.seconds);
    if (phase.textContent !== labels[state.phase]) phase.textContent = labels[state.phase];
    start.textContent = state.phase === 'running' ? 'Пауза' : state.phase === 'paused' ? 'Продолжить' : 'Старт';
    toggle.setAttribute('aria-label', `${state.phase === 'running' ? 'Приостановить' : 'Запустить'} таймер, ${state.seconds} секунд`);
    doc.querySelectorAll('[data-seconds]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.seconds) === state.duration)));
  };
  const change = action => { action(); render(); };
  const switchState = () => change(() => timer.snapshot().phase === 'running' ? timer.pause() : timer.start());
  toggle.addEventListener('click', switchState);
  start.addEventListener('click', switchState);
  doc.getElementById('reset').addEventListener('click', () => change(() => timer.reset()));
  doc.querySelectorAll('[data-seconds]').forEach(button => button.addEventListener('click', () => change(() => timer.select(Number(button.dataset.seconds)))));
  render();
  let interval = null;
  const resumeRefresh = () => {
    if (interval === null) interval = setInterval(render, 200);
    render();
  };
  window.addEventListener('pagehide', () => {
    clearInterval(interval);
    interval = null;
  });
  window.addEventListener('pageshow', resumeRefresh);
  resumeRefresh();
  return timer;
}

if (typeof document !== 'undefined') mountTimer();
