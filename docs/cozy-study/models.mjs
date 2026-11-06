/* Independently authored local calendar and clock helpers. */
export function monthCells(year, month, compact = false) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const count = compact && offset + days <= 35 ? 35 : 42;
  return Array.from({length:count}, (_, index) => new Date(year, month, index - offset + 1));
}
export function clockParts(now, smooth = false) {
  const seconds = now.getSeconds() + (smooth ? now.getMilliseconds() / 1000 : 0);
  const minutes = now.getMinutes() + seconds / 60;
  return {seconds, minutes, hours:now.getHours() % 12 + minutes / 60};
}
export function localClockLabels(now, locale = 'ru-RU') {
  return {
    weekday:now.toLocaleDateString(locale, {weekday:'long'}),
    date:now.toLocaleDateString(locale, {day:'numeric', month:'long'}),
    hour:String(now.getHours()).padStart(2, '0'), minute:String(now.getMinutes()).padStart(2, '0'),
  };
}
