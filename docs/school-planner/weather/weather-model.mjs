/* Weather response shape shared with offline validation. No values are fabricated. */
export function validWeatherData(data, count = 5) {
  const daily = data?.daily;
  return [5, 7].includes(count)
    && typeof data?.current?.temperature_2m === 'number' && Number.isFinite(data.current.temperature_2m)
    && Number.isInteger(data.current.weather_code) && daily
    && ['time', 'weather_code', 'temperature_2m_max', 'temperature_2m_min']
      .every(key => Array.isArray(daily[key]) && daily[key].length >= count)
    && daily.time.slice(0, count).every(day => /^\d{4}-\d{2}-\d{2}$/.test(day))
    && ['weather_code', 'temperature_2m_max', 'temperature_2m_min']
      .every(key => daily[key].slice(0, count).every(value => typeof value === 'number' && Number.isFinite(value)));
}
