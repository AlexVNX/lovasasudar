const status = document.getElementById('cookie-status');
const CONSENT_KEY = 'lvas_consent';

function saveConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
    return true;
  } catch {
    return false;
  }
}

function expireAnalyticsCookies() {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  const domains = new Set(['', location.hostname, '.lovasasudar.com', 'lovasasudar.com']);
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (name !== '_ga' && !name.startsWith('_ga_')) continue;
    for (const domain of domains) {
      const domainAttribute = domain ? `; Domain=${domain}` : '';
      document.cookie = `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/${domainAttribute}; SameSite=Lax${secure}`;
    }
  }
}

document.getElementById('reject').addEventListener('click', () => {
  const saved = saveConsent('reject');
  if (window.gtag) window.gtag('consent', 'update', { analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied' });
  expireAnalyticsCookies();
  status.textContent = saved
    ? 'Analítica rechazada. La calculadora seguirá funcionando.'
    : 'Analítica rechazada en esta página, pero no se pudo guardar la preferencia porque el almacenamiento local está bloqueado.';
});

document.getElementById('accept').addEventListener('click', () => {
  const saved = saveConsent('accept');
  status.textContent = saved
    ? 'Preferencia guardada. La analítica se cargará en páginas posteriores.'
    : 'No se pudo guardar la preferencia porque el almacenamiento local está bloqueado. La analítica no se activará.';
});
