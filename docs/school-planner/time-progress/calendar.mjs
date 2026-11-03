// Calendar arithmetic is kept separate from the view so it can be tested offline.
const DAY = 86_400_000;
const formatters = new Map();
const dayStarts = new Map();
export const PERIOD_IDS = Object.freeze(['day', 'week', 'month', 'year']);

export function resolveTimeZone(candidate, fallback = 'UTC') {
  for (const zone of [candidate, fallback, 'UTC']) {
    if (typeof zone !== 'string' || !zone.trim()) continue;
    try {
      return new Intl.DateTimeFormat('en-US', {timeZone: zone.trim()})
        .resolvedOptions().timeZone;
    } catch { /* Invalid query parameters must not break the embed. */ }
  }
  return 'UTC';
}

function formatter(zone) {
  if (!formatters.has(zone)) {
    formatters.set(zone, new Intl.DateTimeFormat('en-US-u-ca-gregory-nu-latn', {
      timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
    }));
  }
  return formatters.get(zone);
}

function civilStamp(epoch, zone) {
  const parts = {};
  for (const {type, value} of formatter(zone).formatToParts(epoch)) {
    if (type === 'year' || type === 'month' || type === 'day') parts[type] = Number(value);
  }
  return Date.UTC(parts.year, parts.month - 1, parts.day);
}

// Find the first instant of a local date, not "midnight plus 24 hours".
// That distinction is important for 23/25-hour days and timezone changes.
function startOfDate(stamp, zone) {
  const key = `${zone}:${stamp}`;
  if (dayStarts.has(key)) return dayStarts.get(key);
  let low = Math.floor((stamp - 1.5 * DAY) / 1000);
  let high = Math.floor((stamp + 1.5 * DAY) / 1000);
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (civilStamp(middle * 1000, zone) < stamp) low = middle + 1;
    else high = middle;
  }
  const result = low * 1000;
  if (dayStarts.size >= 512) dayStarts.delete(dayStarts.keys().next().value);
  dayStarts.set(key, result);
  return result;
}

export function calculateProgress(instant = new Date(), requestedZone = 'UTC') {
  const epoch = instant instanceof Date ? instant.getTime() : new Date(instant).getTime();
  if (!Number.isFinite(epoch)) throw new RangeError('A valid date is required.');
  const timeZone = resolveTimeZone(requestedZone);
  const today = civilStamp(epoch, timeZone);
  const date = new Date(today);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const monday = today - ((date.getUTCDay() + 6) % 7) * DAY;
  const ranges = {
    day: [today, today + DAY],
    week: [monday, monday + 7 * DAY],
    month: [Date.UTC(year, month, 1), Date.UTC(year, month + 1, 1)],
    year: [Date.UTC(year, 0, 1), Date.UTC(year + 1, 0, 1)],
  };
  return {
    timeZone,
    at: new Date(epoch).toISOString(),
    periods: PERIOD_IDS.map(id => {
      const [startDate, endDate] = ranges[id];
      const start = startOfDate(startDate, timeZone);
      const end = startOfDate(endDate, timeZone);
      const value = Math.max(0, Math.min(1, (epoch - start) / (end - start)));
      return {id, start, end, value};
    }),
  };
}

// Integer labels never say 100% before the period has actually ended.
export function percentageLabel(value) {
  return `${Math.floor(Math.max(0, Math.min(1, value)) * 100 + 1e-9)}%`;
}
