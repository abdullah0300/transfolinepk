/* TransfoLine — "Contact" conversion tracking
   Fires the Google Ads "Contact" conversion (account AW-18209343983)
   whenever any Call (tel:) or WhatsApp (wa.me / whatsapp) link is clicked,
   anywhere on the site. Also sends a GA4 event tagged with the method so
   call vs WhatsApp can be told apart in Analytics. */
(function () {
  'use strict';
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = (a.getAttribute('href') || '').toLowerCase();
    var method = null;
    if (href.indexOf('tel:') === 0) method = 'call';
    else if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1) method = 'whatsapp';
    if (!method) return;
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', { 'send_to': 'AW-18209343983/9LpPCInxl74cEO-T8upD' });
      gtag('event', 'contact_click', { 'method': method });
    }
  }, true);
})();
