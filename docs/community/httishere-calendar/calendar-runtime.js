// Local query compatibility for the Apache-2.0 calendar adaptation.
// Supports plain URL parameters. Upstream encrypted configuration is not used.
function getQueryString(name) {
  return new URLSearchParams(location.search).get(name);
}
function getAllParams() {
  return Object.fromEntries(new URLSearchParams(location.search));
}
function handleDarkMode(params = {}) {
  if (params.dd === '1' || params.black === 'true') {
    document.documentElement.setAttribute('theme', 'dark');
  }
}
