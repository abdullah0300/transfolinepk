/* TransfoLine — interactions (robust for all pages) */
(function () {
  'use strict';

  /* ---- Mobile menu ---- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (nav && burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  if (nav && mobileMenu && burger) {
    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Mobile Dropdown Trigger ---- */
  var mobileServicesBtn = document.getElementById('mobileServicesBtn');
  var mobileServicesMenu = document.getElementById('mobileServicesMenu');
  if (mobileServicesBtn && mobileServicesMenu) {
    mobileServicesBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = mobileServicesMenu.classList.toggle('open');
      mobileServicesBtn.classList.toggle('open', open);
      mobileServicesBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---- Mobile Nested Testing Submenu Trigger ---- */
  var mobileTestingBtn = document.getElementById('mobileTestingBtn');
  var mobileTestingMenu = document.getElementById('mobileTestingMenu');
  if (mobileTestingBtn && mobileTestingMenu) {
    mobileTestingBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = mobileTestingMenu.classList.toggle('open');
      mobileTestingBtn.classList.toggle('open', open);
      mobileTestingBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---- FAQ: single-open accordion + category filter ---- */
  var faqList = document.getElementById('faqList');
  if (faqList) {
    var faqs = Array.prototype.slice.call(faqList.querySelectorAll('.faq'));
    faqs.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) {
          faqs.forEach(function (o) { if (o !== d) o.open = false; });
        }
      });
    });
  }

  var cats = document.getElementById('faqCats');
  if (cats && faqList) {
    var faqsList = Array.prototype.slice.call(faqList.querySelectorAll('.faq'));
    cats.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq-cat');
      if (!btn) return;
      cats.querySelectorAll('.faq-cat').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-cat');
      faqsList.forEach(function (d) {
        var show = cat === 'all' || d.getAttribute('data-cat') === cat;
        d.style.display = show ? '' : 'none';
        if (!show) d.open = false;
      });
    });
  }

  /* ---- Quote form validation + success state ---- */
  var form = document.getElementById('quoteForm');
  if (form) {
    function setErr(field, on) { field.classList.toggle('err', on); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var name = form.elements['name'];
      var phone = form.elements['phone'];
      var service = form.elements['service'];

      if (name) {
        var nf = name.closest('.field');
        if (!name.value.trim()) { setErr(nf, true); ok = false; } else setErr(nf, false);
      }

      if (phone) {
        var pf = phone.closest('.field');
        var digits = phone.value.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 13) { setErr(pf, true); ok = false; } else setErr(pf, false);
      }

      if (service) {
        var sf = service.closest('.field');
        if (!service.value) { setErr(sf, true); ok = false; } else setErr(sf, false);
      }

      if (!ok) {
        var firstErr = form.querySelector('.field.err input, .field.err select');
        if (firstErr) firstErr.focus();
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending…';
      }

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
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = 'Send Request <span class="ar">→</span>';
          }
          alert('Something went wrong. Please call us at 0314 4641288.');
        }
      }).catch(function () {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = 'Send Request <span class="ar">→</span>';
        }
        alert('Network error. Please call us at 0314 4641288.');
      });
    });

    form.addEventListener('input', function (e) {
      var f = e.target.closest('.field');
      if (f && f.classList.contains('err')) f.classList.remove('err');
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
})();
