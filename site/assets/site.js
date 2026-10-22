(() => {
  'use strict';
  const config = window.WATATSUDU_ANALYTICS || {};
  const configured = config.enabled === true && /^G-[A-Z0-9]+$/.test(config.measurementId || '');
  const production = location.hostname === 'watatsudu.github.io';
  const key = 'watatsudu-site-analytics-consent-v1';
  let started = false;
  const choice = () => { try { return localStorage.getItem(key); } catch { return null; } };
  const persist = value => { try { localStorage.setItem(key, value); } catch {} };
  const allowedPages = ['/site/', '/site/story/', '/site/bundle/', '/site/site-privacy/', '/site/apps/goshuin/', '/site/apps/kusabana/', '/site/apps/sotogohan/', '/site/apps/pet/'];
  const safePath = allowedPages.includes(location.pathname) ? location.pathname : '/site/other/';
  const params = new URLSearchParams(location.search);
  // Local review only: load all official images for complete-page QA captures.
  if (location.hostname === '127.0.0.1' && params.get('review') === '1') document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
  const fromLine = params.get('utm_source') === 'line';
  const content = ['welcome', 'richmenu_apps', 'richmenu_bundle'].includes(params.get('utm_content')) ? params.get('utm_content') : 'other';
  // No raw query strings, user text, arbitrary titles, or individual referrers.
  const pageData = { page_location: 'https://watatsudu.github.io' + safePath, page_referrer: '', page_title: safePath, site_area: 'official_apps', ...(fromLine ? { campaign_source: 'line', campaign_medium: 'owned', campaign_name: 'cpf_followup', campaign_content: content } : {}) };
  function start() {
    if (!allowedPages.includes(location.pathname) || !configured || !production || started || navigator.doNotTrack === '1') return;
    started = true;
    window['ga-disable-' + config.measurementId] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', config.measurementId, { ...pageData, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    window.gtag('event', 'page_view', pageData);
    const script = document.createElement('script'); script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.measurementId);
    document.head.append(script);
  }
  function event(name, data) {
    if (started && choice() === 'accepted') window.gtag('event', name, { ...pageData, ...data, send_to: config.measurementId, transport_type: 'beacon' });
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a) return;
    if (a.dataset.app && ['goshuin', 'kusabana', 'sotogohan', 'pet', 'bundle'].includes(a.dataset.app)) event('app_store_click', { app_name: a.dataset.app, cta_position: a.dataset.cta || 'unknown' });
    else if (a.origin === location.origin && allowedPages.includes(a.pathname)) event('internal_navigation', { destination_path: a.pathname });
    if (a.hash === '#privacy-heading') document.querySelector('.policy-home details')?.setAttribute('open', '');
  });
  if (location.hash === '#privacy-heading') document.querySelector('.policy-home details')?.setAttribute('open', '');
  const panel = document.createElement('section'); panel.className = 'consent'; panel.hidden = true;
  panel.setAttribute('aria-label', 'アクセス解析の選択');
  panel.innerHTML = '<p>サイトの使いやすさを確かめるため、閲覧とApp Storeへのクリックを集計します。アプリ内の写真や記録は対象にしません。<a href="/site/site-privacy/">詳しく見る</a></p><div><button class="button secondary" type="button" data-consent="declined">同意しない</button><button class="button" type="button" data-consent="accepted">同意する</button></div>';
  document.body.append(panel);
  panel.addEventListener('click', e => {
    const button = e.target.closest('[data-consent]'); if (!button) return;
    persist(button.dataset.consent); panel.hidden = true;
    if (button.dataset.consent === 'accepted') { window['ga-disable-' + config.measurementId] = false; start(); }
    else if (configured) { window['ga-disable-' + config.measurementId] = true;
      document.cookie.split(';').forEach(part => { const name = part.trim().split('=')[0]; if (/^_ga(?:_|$)/.test(name)) document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax'; });
    }
  });
  document.querySelectorAll('[data-analytics-settings]').forEach(button => button.addEventListener('click', () => {
    const status = document.getElementById('analytics-status');
    if (!configured || !production) { if (status) status.textContent = '現在、アクセス解析は無効です'; return; }
    panel.hidden = false; panel.querySelector('button')?.focus();
  }));
  if (configured && production && navigator.doNotTrack !== '1') { if (choice() === 'accepted') start(); else if (!choice()) panel.hidden = false; }
})();
