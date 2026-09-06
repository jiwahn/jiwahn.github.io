// Exercise the analytics loader without making requests to Google.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../assets/js/analytics.js'), 'utf8');

function run(hostname, measurementId = 'G-TEST123456', siteUrl = 'https://jiwahn.github.io', excluded = false) {
  const scripts = [];
  const window = {
    location: { hostname },
    portfolioAnalytics: excluded === null ? undefined : { isExcluded: () => excluded },
  };
  const document = {
    currentScript: { dataset: { measurementId, siteUrl } },
    createElement: () => ({}),
    head: { append: (script) => scripts.push(script) },
  };
  vm.runInNewContext(source, { window, document, URL });
  return { scripts, window };
}

for (const hostname of ['localhost', '127.0.0.1', '[::1]', 'preview.example.com']) {
  assert.equal(run(hostname).scripts.length, 0);
}
assert.equal(run('localhost', 'G-TEST123456', 'http://localhost:4000').scripts.length, 0);
for (const id of ['', 'UA-123-1', 'G-invalid']) {
  assert.equal(run('jiwahn.github.io', id).scripts.length, 0);
}
assert.equal(run('jiwahn.github.io', 'G-TEST123456', 'https://jiwahn.github.io', true).scripts.length, 0);
assert.equal(run('jiwahn.github.io', 'G-TEST123456', 'https://jiwahn.github.io', null).scripts.length, 0);

const live = run('jiwahn.github.io');
assert.equal(live.scripts.length, 1);
assert.equal(live.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-TEST123456');
assert.equal(live.scripts[0].async, true);
assert.equal(live.window.dataLayer[1][0], 'config');
assert.equal(live.window.dataLayer[1][1], 'G-TEST123456');
assert.equal(live.window.dataLayer[1][2].allow_google_signals, false);
assert.equal(live.window.dataLayer[1][2].allow_ad_personalization_signals, false);
const preferenceSource = fs.readFileSync(path.join(__dirname, '../assets/js/analytics-preferences.js'), 'utf8');
function preferences({ saved = null, blocked = false } = {}) {
  const storage = new Map(saved === null ? [] : [['portfolio.analytics.excluded', saved]]);
  const listeners = {};
  const button = { disabled: true, addEventListener: (type, listener) => { listeners[type] = listener; } };
  const status = {};
  const controls = { querySelector: (selector) => selector === '[data-analytics-toggle]' ? button : status };
  const window = {
    localStorage: {
      getItem: (key) => { if (blocked) throw new Error('Storage blocked'); return storage.get(key) ?? null; },
      setItem: (key, value) => { if (blocked) throw new Error('Storage blocked'); storage.set(key, value); },
    },
    addEventListener: (type, listener) => { listeners[type] = listener; },
  };
  const document = {
    currentScript: { dataset: { analyticsId: 'G-TEST123456' } },
    querySelector: () => controls,
  };
  vm.runInNewContext(preferenceSource, { window, document });
  return { window, storage, listeners, button, status };
}

const settings = preferences();
assert.equal(settings.window.portfolioAnalytics.isExcluded(), false);
settings.listeners.click();
assert.equal(settings.storage.get('portfolio.analytics.excluded'), 'true');
assert.equal(settings.window['ga-disable-G-TEST123456'], true);
assert.equal(settings.button.textContent, '수집 다시 켜기');
assert.equal(preferences({ saved: 'true' }).window.portfolioAnalytics.isExcluded(), true);
settings.listeners.click();
assert.equal(settings.window.portfolioAnalytics.isExcluded(), false);
settings.storage.set('portfolio.analytics.excluded', 'true');
settings.listeners.storage({ key: 'portfolio.analytics.excluded' });
assert.equal(settings.window['ga-disable-G-TEST123456'], true);
settings.storage.clear();
settings.listeners.storage({ key: null });
assert.equal(settings.window['ga-disable-G-TEST123456'], false);
const blocked = preferences({ blocked: true });
assert.equal(blocked.window.portfolioAnalytics.isExcluded(), true);
blocked.listeners.click();
assert.match(blocked.status.textContent, /저장을 허용하지/);
console.log('OK: production-only loader, opt-out persistence, restore, cross-tab updates, and blocked storage.');
