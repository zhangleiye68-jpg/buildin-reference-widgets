// Independent implementation. No Kairo application code is used here.
export const LIMIT = 999999;
export const PRESETS = Object.freeze({
  read: Object.freeze({ title: 'Прочитать 10 страниц', goal: 10, icon: 'book.svg' }),
  drink: Object.freeze({ title: 'Выпить 8 стаканов воды', goal: 8, icon: 'drink.svg' }),
  exercise: Object.freeze({ title: 'Тренировка', goal: 1, icon: 'exercise.svg' }),
});

function positiveInteger(value, fallback, maximum = 9999) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 && number <= maximum ? number : fallback;
}

export function configuration(type, search = '') {
  if (!Object.hasOwn(PRESETS, type)) throw new TypeError('Unknown goal preset');
  const params = new URLSearchParams(search);
  const preset = PRESETS[type];
  const customTitle = params.get('title')?.trim();
  const instance = params.get('id')?.trim().slice(0, 80) || 'default';
  return Object.freeze({
    ...preset, type, instance,
    title: customTitle ? customTitle.slice(0, 120) : preset.title,
    goal: positiveInteger(params.get('goal'), preset.goal),
    step: positiveInteger(params.get('step'), 1),
    // The namespace includes the preset, so three separate iframes cannot share counts.
    key: `student-planner:independent-goals:v2:${type}:${encodeURIComponent(instance)}`,
  });
}

export function emptyState() { return { count: 0, updatedAt: null }; }

export function decode(raw) {
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 2 || !Number.isSafeInteger(value.count)
        || value.count < 0 || value.count > LIMIT) return emptyState();
    const updatedAt = Number.isFinite(value.updatedAt) && value.updatedAt > 0 ? value.updatedAt : null;
    return { count: value.count, updatedAt };
  } catch { return emptyState(); }
}

export function encode(state) { return JSON.stringify({ version: 2, ...state }); }

export function change(state, delta, now = Date.now()) {
  const count = Math.max(0, Math.min(LIMIT, state.count + delta));
  return count === state.count ? state : { count, updatedAt: now };
}

export function fraction(count, goal) { return Math.max(0, Math.min(1, count / goal)); }

export function relativeTime(updatedAt, now = Date.now()) {
  if (updatedAt === null) return '— —';
  const seconds = Math.max(0, Math.floor((now - updatedAt) / 1000));
  if (seconds < 45) return 'только что';
  const [unit, value] = seconds < 3600 ? ['minute', Math.max(1, Math.floor(seconds / 60))]
    : seconds < 86400 ? ['hour', Math.floor(seconds / 3600)]
      : ['day', Math.floor(seconds / 86400)];
  return new Intl.RelativeTimeFormat('ru', { numeric: 'always' }).format(-value, unit);
}

export function persistence(storage, key) {
  // Sandboxed embeds and private modes can deny storage. Counting still works in memory.
  return {
    read() { try { return decode(storage?.getItem(key)); } catch { return emptyState(); } },
    write(state) { try { storage?.setItem(key, encode(state)); return Boolean(storage); } catch { return false; } },
  };
}
