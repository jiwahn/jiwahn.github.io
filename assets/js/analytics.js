(() => {
  const { measurementId, siteUrl } = document.currentScript.dataset;
  if (!/^G-[A-Z0-9]+$/.test(measurementId || '')) return;

  const hostname = window.location.hostname;
  if (['localhost', '127.0.0.1', '[::1]'].includes(hostname)) return;
  if (hostname !== new URL(siteUrl).hostname) return;
  if (!window.portfolioAnalytics || window.portfolioAnalytics.isExcluded()) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.append(script);
})();
