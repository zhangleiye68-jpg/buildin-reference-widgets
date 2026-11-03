import {calculateProgress, percentageLabel, resolveTimeZone} from './calendar.mjs';

const params = new URLSearchParams(location.search);
const locale = /^zh(?:-|$)/i.test(params.get('locale') || '') ? 'zh-CN' : 'ru';
const words = {
  'zh-CN': {title: '时间进度', day: '今日', week: '本周', month: '本月', year: '今年', demo: '示意数据'},
  ru: {title: 'Прогресс времени', day: 'День', week: 'Неделя', month: 'Месяц', year: 'Год', demo: 'Пример'},
}[locale];
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const timeZone = resolveTimeZone(params.get('tz'), localZone);
const isDemo = params.get('demo') === '1';
const examples = {day: 0.97, week: 0.85, month: 0.20, year: 0.43};
const widget = document.querySelector('.time-progress');
document.documentElement.lang = locale;
document.title = `${words.title}${isDemo ? ` · ${words.demo}` : ''}`;
widget.setAttribute('aria-label', document.title);
widget.dataset.mode = isDemo ? 'demo' : 'live';
widget.dataset.timeZone = timeZone;

const rows = [...document.querySelectorAll('.progress-row')].map(row => {
  const id = row.dataset.period;
  row.querySelector('.period-name').textContent = words[id];
  const track = row.querySelector('.track');
  track.setAttribute('aria-label', words[id]);
  return {id, track, fill: row.querySelector('.fill'), percentage: row.querySelector('.percentage')};
});
const previous = new Map();

function update() {
  const result = calculateProgress(new Date(), timeZone);
  for (const {id, track, fill, percentage} of rows) {
    const period = result.periods.find(item => item.id === id);
    const value = isDemo ? examples[id] : period.value;
    const old = previous.get(id);
    // Never animate an initial load, a day/week/month/year reset, or a large
    // clock correction. Only the fill edge moves; the frame stays stationary.
    fill.dataset.animate = String(!isDemo && Boolean(old)
      && old.start === period.start && value >= old.value && value - old.value < 0.01);
    fill.style.width = `${(value * 100).toFixed(6)}%`;
    const label = percentageLabel(value);
    if (percentage.textContent !== label) percentage.textContent = label;
    if (track.getAttribute('aria-valuenow') !== String(parseInt(label, 10))) {
      track.setAttribute('aria-valuenow', String(parseInt(label, 10)));
      track.setAttribute('aria-valuetext', `${words[id]} ${label}`);
    }
    track.dataset.value = String(value);
    previous.set(id, {start: period.start, value});
  }
  widget.dataset.updatedAt = result.at;
  widget.dataset.ready = 'true';
}

let timer;
function schedule() {
  clearTimeout(timer);
  if (isDemo || document.hidden) return;
  timer = setTimeout(() => { update(); schedule(); }, 1000 - Date.now() % 1000);
}
document.addEventListener('visibilitychange', () => { update(); schedule(); });
window.addEventListener('pageshow', () => { update(); schedule(); });
window.addEventListener('pagehide', () => clearTimeout(timer));
update();
schedule();
