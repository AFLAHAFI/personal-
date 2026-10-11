// Apply the saved theme before the first paint. Storage is optional.
(() => {
  let theme = 'dark';
  try { theme = localStorage.getItem('aflah-theme') === 'light' ? 'light' : 'dark'; } catch {}
  document.documentElement.dataset.theme = theme;
})();
