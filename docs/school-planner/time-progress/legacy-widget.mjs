import {BAR_ORDER, parseBirth, legacyValues, legacyLabel} from './legacy-model.mjs?rev=20261106-1';
const query = new URLSearchParams(location.search);
const root = document.querySelector('main');
const html = document.documentElement;
const color = value => /^#[\da-f]{6}(?:[\da-f]{2})?$/i.test(value || '') ? value : null;
const ink = color(query.get('color')), darkInk = color(query.get('dark_color'));
if (ink) {html.style.setProperty('--ink', ink); html.style.setProperty('--light-ink', ink);}
if (darkInk) html.style.setProperty('--dark-ink', darkInk);
if (query.get('theme') === 'system') html.dataset.theme = 'system';
const background = color(query.get('background'));
if (background) document.body.style.background = background;
const bars = [...new Set((query.has('bars') ? query.get('bars') : 'year,month,week').split(',').filter(id => BAR_ORDER.includes(id)))];
const birth = parseBirth(new URLSearchParams(location.hash.slice(1)).get('birth'));
const requestedAge = Number(query.get('lifespan'));
const age = Number.isFinite(requestedAge) && requestedAge > 0 && requestedAge <= 150 ? requestedAge : 80;
const decimals = query.get('decimals') || 0;
const words = {year:'Год', month:'Месяц', week:'Неделя', day:'День', quarter:'Квартал', life:'Жизнь'};
html.style.setProperty('--rows', Math.max(1, bars.length));
const rows = bars.map(id => {
  const row = document.createElement('div'); row.className = 'progress-row'; row.dataset.period = id;
  row.innerHTML = '<div class="track" role="progressbar" aria-valuemin="0" aria-valuemax="100"><div class="fill"></div></div><div class="label" aria-hidden="true"><span class="period-name"></span><span class="percentage"></span></div>';
  row.querySelector('.period-name').textContent = words[id];
  root.append(row);
  return {id, track:row.querySelector('.track'), fill:row.querySelector('.fill'), label:row.querySelector('.percentage')};
});
function render() {
  const now = new Date(), values = legacyValues(now, birth, age);
  for (const {id, track, fill, label} of rows) {
    const value = values[id], text = legacyLabel(value, decimals);
    const bounded = value === null ? 0 : Math.max(0, Math.min(1, value));
    fill.style.width = `${bounded * 100}%`;
    label.textContent = text;
    track.setAttribute('aria-label', `${words[id]} ${text}`);
    track.setAttribute('aria-valuenow', String(bounded * 100));
    track.dataset.value = value === null ? '' : String(value);
  }
  root.dataset.ready = 'true'; root.dataset.updatedAt = now.toISOString();
}
render(); setInterval(render, 5000);
document.addEventListener('visibilitychange', render);
window.addEventListener('pageshow', render);
