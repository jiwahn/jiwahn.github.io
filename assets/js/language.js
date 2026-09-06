(() => {
  const storageKey = 'portfolio.language';
  const sessionKey = 'portfolio.language.detected';
  const paths = {};
  for (const link of document.querySelectorAll('link[data-language]')) {
    paths[link.dataset.language] = link.dataset.path;
  }
  const current = document.documentElement.lang;
  let preferred;
  try {
    preferred = localStorage.getItem(storageKey);
    if (!['ko', 'en'].includes(preferred)) {
      if (!sessionStorage.getItem(sessionKey)) {
        const browserLanguage = navigator.languages?.[0] || navigator.language || 'en';
        preferred = /^ko(?:-|$)/i.test(browserLanguage) ? 'ko' : 'en';
      }
    }
    sessionStorage.setItem(sessionKey, 'true');
  } catch {
    // Keep the requested URL when storage is blocked; do not risk redirect loops.
    preferred = current;
  }
  if (paths[preferred] && preferred !== current) {
    location.replace(paths[preferred] + location.search + location.hash);
  }
  document.addEventListener('DOMContentLoaded', () => {
    const links = [...document.querySelectorAll('[data-language-choice]')];
    function updateLinks() {
      for (const link of links) {
        link.href = paths[link.dataset.languageChoice] + location.search + location.hash;
      }
    }
    updateLinks();
    window.addEventListener('hashchange', updateLinks);
    for (const link of links) {
      link.addEventListener('click', () => {
        updateLinks();
        try { localStorage.setItem(storageKey, link.dataset.languageChoice); } catch { /* Links still work. */ }
      });
    }
  });
})();
