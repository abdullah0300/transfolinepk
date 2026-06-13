/* TransfoLine homepage — interactions */
(function () {
  'use strict';

  /* ---- Mobile menu ---- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.getElementById('mobileMenu').addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---- FAQ: single-open accordion + category filter ---- */
  var faqList = document.getElementById('faqList');
  var faqs = Array.prototype.slice.call(faqList.querySelectorAll('.faq'));
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) {
        faqs.forEach(function (o) { if (o !== d) o.open = false; });
      }
    });
  });

  var cats = document.getElementById('faqCats');
  cats.addEventListener('click', function (e) {
    var btn = e.target.closest('.faq-cat');
    if (!btn) return;
    cats.querySelectorAll('.faq-cat').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var cat = btn.getAttribute('data-cat');
    faqs.forEach(function (d) {
      var show = cat === 'all' || d.getAttribute('data-cat') === cat;
      d.style.display = show ? '' : 'none';
      if (!show) d.open = false;
    });
  });

  /* ---- Quote form validation + success state ---- */
  var form = document.getElementById('quoteForm');
  function setErr(field, on) { field.classList.toggle('err', on); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    var name = form.elements['name'];
    var phone = form.elements['phone'];
    var service = form.elements['service'];

    var nf = name.closest('.field');
    if (!name.value.trim()) { setErr(nf, true); ok = false; } else setErr(nf, false);

    var pf = phone.closest('.field');
    var digits = phone.value.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 13) { setErr(pf, true); ok = false; } else setErr(pf, false);

    var sf = service.closest('.field');
    if (!service.value) { setErr(sf, true); ok = false; } else setErr(sf, false);

    if (!ok) {
      var firstErr = form.querySelector('.field.err input, .field.err select');
      if (firstErr) firstErr.focus();
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        if (typeof gtag === 'function') {
          gtag('event', 'conversion', {'send_to': 'AW-18209343983/KyllCNzzsL4cEO-T8upD'});
          gtag('event', 'generate_lead', { 'form': 'homepage' });
        }
        form.classList.add('sent');
        form.reset();

      } else {
        btn.disabled = false;
        btn.innerHTML = 'Send Request <span class="ar">→</span>';
        alert('Something went wrong. Please call us at 0314 4641288.');
      }
    }).catch(function () {
      btn.disabled = false;
      btn.innerHTML = 'Send Request <span class="ar">→</span>';
      alert('Network error. Please call us at 0314 4641288.');
    });
  });

  form.addEventListener('input', function (e) {
    var f = e.target.closest('.field');
    if (f && f.classList.contains('err')) f.classList.remove('err');
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
})();
