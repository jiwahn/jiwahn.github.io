// Verify language selection without changing the real browser or making requests.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/js/language.js'), 'utf8');

function run({ lang = 'ko', browser = 'en-US', saved = null, visited = false, blocked = false } = {}) {
  const storage = new Map(saved ? [['portfolio.language', saved]] : []);
  const session = new Map(visited ? [['portfolio.language.detected', 'true']] : []);
  const events = {};
  const links = ['ko', 'en'].map((language) => ({
    dataset: { languageChoice: language },
    addEventListener(type, listener) { this[type] = listener; },
  }));
  const location = { search: '?test=1', hash: '#category=cloud', replace(url) { this.redirect = url; } };
  const document = {
    documentElement: { lang },
    querySelectorAll(selector) {
      return selector === 'link[data-language]'
        ? ['ko', 'en'].map((language) => ({ dataset: { language, path: language === 'ko' ? '/projects/opensource/' : '/en/projects/opensource/' } }))
        : links;
    },
    addEventListener(type, listener) { events[type] = listener; },
  };
  function store(map) {
    return {
      getItem(key) { if (blocked) throw new Error('Blocked'); return map.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw new Error('Blocked'); map.set(key, value); },
    };
  }
  const window = { addEventListener(type, listener) { events[type] = listener; } };
  vm.runInNewContext(source, { document, window, location, navigator: { languages: [browser], language: browser }, localStorage: store(storage), sessionStorage: store(session) });
  events.DOMContentLoaded();
  return { storage, session, links, location, events };
}

assert.equal(run().location.redirect, '/en/projects/opensource/?test=1#category=cloud');
for (const browser of ['ko', 'ko-KR', 'KO-kr']) assert.equal(run({ browser }).location.redirect, undefined);
for (const browser of ['ja-JP', 'fr-FR', 'en']) assert.ok(run({ browser }).location.redirect);
assert.equal(run({ lang: 'en', browser: 'ko-KR' }).location.redirect, '/projects/opensource/?test=1#category=cloud');
assert.equal(run({ lang: 'en', saved: 'ko' }).location.redirect, '/projects/opensource/?test=1#category=cloud');
assert.equal(run({ saved: 'en', browser: 'ko-KR' }).location.redirect, '/en/projects/opensource/?test=1#category=cloud');
assert.equal(run({ visited: true }).location.redirect, undefined);
assert.equal(run({ lang: 'en', visited: true }).location.redirect, undefined);
assert.equal(run({ blocked: true }).location.redirect, undefined);
const result = run();
result.links[0].click();
assert.equal(result.storage.get('portfolio.language'), 'ko');
result.location.hash = '#tag=containers';
result.events.hashchange();
assert.equal(result.links[1].href, '/en/projects/opensource/?test=1#tag=containers');
assert.doesNotThrow(() => run({ blocked: true }).links[1].click());

// Every non-redirect page must have a localized counterpart and correct metadata.
const build = path.join(root, '_site');
const koreanPages = fs.readdirSync(build, { recursive: true })
  .filter((file) => file.endsWith('.html') && !file.startsWith('en/'));
let pairs = 0;
for (const file of koreanPages) {
  const ko = fs.readFileSync(path.join(build, file), 'utf8');
  if (!ko.includes('data-language-choice')) continue; // Historical redirects keep their old destinations.
  const englishFile = path.join(build, 'en', file);
  assert.ok(fs.existsSync(englishFile), `Missing English page: ${file}`);
  const en = fs.readFileSync(englishFile, 'utf8');
  assert.ok(en.includes('<html lang="en">'), file);
  assert.ok(ko.includes('<html lang="ko">'), file);
  assert.ok(en.includes('hreflang="ko"') && en.includes('hreflang="en"'), file);
  assert.ok(!/[\uac00-\ud7a3]/.test(en), `Korean text left in ${file}`);
  pairs += 1;
}
assert.equal(pairs, 13);
console.log(`OK: ${pairs} bilingual page pairs; browser detection, manual preference, filters, deep links, and blocked storage.`);
