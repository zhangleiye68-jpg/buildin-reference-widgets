/* Display-only Russian configuration overrides. No dates, goals, or identifiers are changed. */
(() => {
  const sourceQuery = window.getQueryString;
  const sourceParams = window.getAllParams;
  const displayQuery = name => new URLSearchParams(window.location.search).get(name);
  window.getQueryString = function (name) {
    if (name === 'name') return displayQuery('ru_name') || sourceQuery(name);
    if (name === 'text') return displayQuery('ru_text') || sourceQuery(name);
    return sourceQuery(name);
  };
  window.getAllParams = function (crypto) {
    const params = sourceParams(crypto);
    const name = displayQuery('ru_name'), text = displayQuery('ru_text');
    if (name) params.name = name;
    if (text) params.content = text;
    const names = displayQuery('ru_tasks');
    if (names) {
      try {
        const values = JSON.parse(names);
        if (Array.isArray(values) && Array.isArray(params.tasks) && values.length === params.tasks.length && values.every(v => typeof v === 'string')) {
          params.tasks = params.tasks.map((task, index) => ({...task, name: values[index]}));
        }
      } catch { /* Invalid optional display overrides must not replace original task data. */ }
    }
    return params;
  };
})();
