(() => {
  const storageKey = 'portfolio.analytics.excluded';
  const measurementId = document.currentScript.dataset.analyticsId;
  const disableKey = 'ga-disable-' + measurementId;

  function isExcluded() {
    try {
      return window.localStorage.getItem(storageKey) === 'true';
    } catch {
      // Do not collect when the browser cannot read its saved preference.
      return true;
    }
  }

  window.portfolioAnalytics = { isExcluded };
  window[disableKey] = isExcluded();

  const controls = document.querySelector('[data-analytics-controls]');
  const button = controls?.querySelector('[data-analytics-toggle]');
  const status = controls?.querySelector('[data-analytics-status]');

  function render() {
    if (!controls) return;
    const excluded = isExcluded();
    status.textContent = excluded
      ? '현재 이 브라우저의 방문 통계 수집이 꺼져 있습니다.'
      : '현재 이 브라우저의 방문 통계 수집이 켜져 있습니다.';
    button.textContent = excluded ? '수집 다시 켜기' : '이 브라우저에서 수집 끄기';
    button.disabled = false;
  }

  button?.addEventListener('click', () => {
    const excluded = !isExcluded();
    try {
      window.localStorage.setItem(storageKey, String(excluded));
      window[disableKey] = excluded;
      render();
    } catch {
      status.textContent = '브라우저가 설정 저장을 허용하지 않습니다. 사이트 데이터 저장 설정을 확인해 주세요.';
    }
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    window[disableKey] = isExcluded();
    render();
  });
  render();
})();
