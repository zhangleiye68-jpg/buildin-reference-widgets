// Source-compatible data models. Labels and presentation are kept separately.
export const DAY = 86400000;
export const pad = n => String(n).padStart(2, '0');
export const legacyLeap = year => year % 4 === 0 && year % 100 !== 0;
export const monthDays = (year, month) => [31, legacyLeap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
export function calendarModel(now, sunday = false) {
  const year = now.getFullYear(), month = now.getMonth(), today = now.getDate();
  const weekday = new Date(year, month, 1).getDay();
  return {year, month, today, weekday: now.getDay(), offset: sunday ? weekday : (weekday + 6) % 7, days: monthDays(year, month), sunday};
}
export function progressModel(now) {
  const weekday = now.getDay() || 7, day = now.getDate(), totalMonth = monthDays(now.getFullYear(), now.getMonth());
  const totalYear = legacyLeap(now.getFullYear()) ? 366 : 365;
  const elapsedYear = Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / DAY);
  return [
    {id: 'year', value: elapsedYear / totalYear, current: elapsedYear, total: totalYear},
    {id: 'month', value: day / totalMonth, current: day, total: totalMonth},
    {id: 'week', value: weekday / 7, current: weekday, total: 7},
  ];
}
export function rangeModel(now, startValue, endValue) {
  const year = now.getFullYear();
  const start = startValue ? new Date(startValue) : new Date(year, 0, 1);
  const end = endValue ? new Date(endValue) : new Date(year, 11, 31, 23, 59);
  end.setHours(23); end.setMinutes(59);
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end < start) throw Error('invalid_date_range');
  if (now <= start) return {state: 'before', percent: 0, start, end};
  if (now >= end) return {state: 'after', percent: 1, start, end};
  const remaining = end.getTime() - now.getTime();
  return {state: 'active', percent: Number(((now - start) / (end - start)).toFixed(2)), days: Math.trunc(remaining / DAY), hours: Math.trunc(remaining / 3600000 % 24), start, end};
}
export function countdownModel(now, day) {
  const target = new Date(`${day} 23:59`);
  if (!Number.isFinite(target.getTime())) throw Error('invalid_countdown_date');
  // Legacy cards truncate toward zero, including the final partial day.
  const difference = Math.trunc((target.getTime() - now.getTime()) / DAY);
  return {state: difference > 0 ? 'future' : difference < 0 ? 'past' : 'today', days: Math.abs(difference), target, day};
}
export function greetingModel(now) {
  const h = now.getHours();
  return {greeting: h < 12 ? 'Доброе утро' : h <= 17 ? 'Добрый день' : 'Добрый вечер', time: `${pad(h % 12 || 12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`, period: h >= 12 ? 'PM' : 'AM'};
}
export const sourceHolidays2025 = [
  {name: 'Новый год', start: '2025/01/01 00:00:00', end: '2025/01/01 23:59:59'},
  {name: 'Китайский Новый год', start: '2025/01/28 00:00:00', end: '2025/02/04 23:59:59'},
  {name: 'Цинмин', start: '2025/04/04 00:00:00', end: '2025/04/06 23:59:59'},
  {name: 'День труда', start: '2025/05/01 00:00:00', end: '2025/05/05 23:59:59'},
  {name: 'Праздник драконьих лодок', start: '2025/05/31 00:00:00', end: '2025/06/02 23:59:59'},
  {name: 'Середина осени / День КНР', start: '2025/10/01 00:00:00', end: '2025/10/08 23:59:59'},
];
export function holidayModel(now, holidays = sourceHolidays2025) {
  return holidays.map(item => ({...item, state: new Date(item.start) > now ? 'future' : new Date(item.end) < now ? 'past' : 'active', days: Math.ceil((new Date(item.start) - now) / DAY)}));
}
export class TimerModel {
  constructor() { this.remaining = 1500; this.running = false; this.endAt = null; }
  start(now, minutes) {
    if (this.running) return;
    if (minutes !== undefined && minutes !== '') {
      const value = Number(minutes);
      if (!Number.isFinite(value) || value <= 0) throw Error('invalid_timer_minutes');
      this.remaining = Math.max(1, Math.round(value * 60));
    }
    this.running = true; this.endAt = now + this.remaining * 1000;
  }
  tick(now) {
    if (!this.running) return;
    this.remaining = Math.max(0, Math.ceil((this.endAt - now) / 1000));
    if (!this.remaining) this.stop();
  }
  stop() { this.running = false; this.remaining = 1500; this.endAt = null; }
  text() { return `${pad(Math.floor(this.remaining / 60))} : ${pad(this.remaining % 60)}`; }
}
