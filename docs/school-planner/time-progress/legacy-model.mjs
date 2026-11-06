/* Independent implementation of documented calendar arithmetic; no provider code. */
const DAY = 86400000;
export const BAR_ORDER = Object.freeze(['year', 'month', 'week', 'day', 'quarter', 'life']);
export const dayOfYear = date => Math.round((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 1)) / DAY) + 1;
export function parseBirth(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}
export function legacyValues(now, birth = null, age = 80) {
  const year = now.getFullYear(), month = now.getMonth(), doy = dayOfYear(now);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const quarterStart = new Date(year, Math.floor(month / 3) * 3, 1);
  const quarterEnd = new Date(year, Math.floor(month / 3) * 3 + 3, 0);
  return {
    year: doy / 365,
    month: now.getDate() / new Date(year, month + 1, 0).getDate(),
    week: (((now.getDay() + 6) % 7) * 1440 + minutes) / 10080,
    day: minutes / 1440,
    quarter: (doy - dayOfYear(quarterStart)) / (dayOfYear(quarterEnd) - dayOfYear(quarterStart)),
    life: birth ? ((now.getTime() - birth.getTime()) / DAY) / (365 * age + Math.trunc(age / 4)) : null,
  };
}
export function legacyLabel(value, decimals = 0) {
  const precision = Math.max(0, Math.min(100, Number.isFinite(Number(decimals)) ? Math.trunc(Number(decimals)) : 0));
  return value === null ? '—' : `${(value * 100).toFixed(precision)}%`;
}
