const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('site/assets/site.js', 'utf8');
function run({ enabled = false, accepted = null, host = 'watatsudu.github.io', search = '', dnt = '0' } = {}) {
  const listeners = {}, store = new Map(accepted ? [['watatsudu-site-analytics-consent-v1', accepted]] : []), scripts = [];
  const panel = { hidden: true, setAttribute() {}, addEventListener(type, fn) { this.listener = fn; }, querySelector() { return { focus() {} }; } };
  const window = { WATATSUDU_ANALYTICS: { enabled, measurementId: enabled ? 'G-TESTONLY' : '' } };
  const context = { window, URLSearchParams, Date, navigator: { doNotTrack: dnt }, location: { hostname: host, pathname: '/site/bundle/', origin: 'https://' + host, search, hash: '' }, localStorage: { getItem: k => store.get(k) || null, setItem: (k, v) => store.set(k, v) }, document: { cookie: '', addEventListener(t, fn) { listeners[t] = fn; }, querySelector() { return null; }, querySelectorAll() { return []; }, getElementById() { return null; }, createElement(tag) { return tag === 'section' ? panel : {}; }, body: { append() {} }, head: { append(s) { scripts.push(s); } } } };
  vm.runInNewContext(source, context);
  const events = () => (window.dataLayer || []).map(x => Array.from(x));
  return { window, panel, scripts, events, click(a) { listeners.click({ target: { closest() { return a; } } }); }, consent(value) { panel.listener({ target: { closest() { return { dataset: { consent: value } }; } } }); } };
}
let t = run(); assert.equal(t.scripts.length, 0); assert.equal(t.events().length, 0);
t = run({ enabled: true }); assert.equal(t.scripts.length, 0); assert.equal(t.panel.hidden, false);
t.consent('declined'); assert.equal(t.scripts.length, 0);
t = run({ enabled: true, accepted: 'accepted', host: '127.0.0.1' }); assert.equal(t.scripts.length, 0);
t = run({ enabled: true, accepted: 'accepted', dnt: '1' }); assert.equal(t.scripts.length, 0);
t = run({ enabled: true, accepted: 'accepted', search: '?utm_source=line&utm_content=welcome&email=private@example.com' });
assert.equal(t.scripts.length, 1); assert.equal(t.events().filter(e => e[1] === 'page_view').length, 1);
const cfg = t.events().find(e => e[0] === 'config')[2]; assert.equal(cfg.send_page_view, false); assert.equal(cfg.campaign_source, 'line');
assert.equal(JSON.stringify(t.events()).includes('private@example.com'), false);
for (const app of ['goshuin', 'kusabana', 'sotogohan', 'pet', 'bundle']) t.click({ dataset: { app, cta: 'detail-hero' }, hash: '' });
assert.equal(t.events().filter(e => e[1] === 'app_store_click').length, 5);
t.click({ dataset: {}, origin: 'https://watatsudu.github.io', pathname: '/site/story/', hash: '' });
assert.equal(t.events().filter(e => e[1] === 'internal_navigation').length, 1);
t.consent('declined'); t.click({ dataset: { app: 'bundle' }, hash: '' }); assert.equal(t.events().filter(e => e[1] === 'app_store_click').length, 5);
console.log('PASS: disabled, no consent, decline, local preview, DNT, one page_view, five app clicks, navigation, LINE attribution, query privacy, consent withdrawal');
