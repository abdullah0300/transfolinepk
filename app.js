/* TransfoLine — Interactions & Navigation System (Robust for Desktop, Tablet & Mobile) */
(function () {
  'use strict';

  /* ---- DOM Elements ---- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileServicesBtn = document.getElementById('mobileServicesBtn');
  var mobileServicesMenu = document.getElementById('mobileServicesMenu');
  var mobileTransformersBtn = document.getElementById('mobileTransformersBtn');
  var mobileTransformersMenu = document.getElementById('mobileTransformersMenu');
  var mobileTestingBtn = document.getElementById('mobileTestingBtn');
  var mobileTestingMenu = document.getElementById('mobileTestingMenu');

  /* ---- 1. Mobile Menu (Hamburger) Toggle ---- */
  if (nav && burger) {
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  /* ---- 2. Mobile Services Dropdown Accordion ---- */
  if (mobileServicesBtn && mobileServicesMenu) {
    function toggleServicesDropdown(e) {
      e.preventDefault();
      e.stopPropagation();
      var isOpen = mobileServicesMenu.classList.toggle('open');
      mobileServicesBtn.classList.toggle('open', isOpen);
      mobileServicesBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    mobileServicesBtn.addEventListener('click', toggleServicesDropdown);
  }

    var mobileSolarBtn = document.getElementById('mobileSolarBtn');
  var mobileSolarMenu = document.getElementById('mobileSolarMenu');
  if (mobileSolarBtn && mobileSolarMenu) {
    function toggleSolarDropdown(e) {
      e.preventDefault();
      e.stopPropagation();
      var isOpen = mobileSolarMenu.classList.toggle('open');
      mobileSolarBtn.classList.toggle('open', isOpen);
      mobileSolarBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    mobileSolarBtn.addEventListener('click', toggleSolarDropdown);
  }

  /* ---- 3. Mobile Nested Transformers Submenu Accordion ---- */
  if (mobileTransformersBtn && mobileTransformersMenu) {
    function toggleTransformersDropdown(e) {
      e.preventDefault();
      e.stopPropagation();
      var isOpen = mobileTransformersMenu.classList.toggle('open');
      mobileTransformersBtn.classList.toggle('open', isOpen);
      mobileTransformersBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    mobileTransformersBtn.addEventListener('click', toggleTransformersDropdown);
  }

  /* ---- 4. Mobile Nested Testing Submenu Accordion ---- */
  if (mobileTestingBtn && mobileTestingMenu) {
    function toggleTestingDropdown(e) {
      e.preventDefault();
      e.stopPropagation();
      var isOpen = mobileTestingMenu.classList.toggle('open');
      mobileTestingBtn.classList.toggle('open', isOpen);
      mobileTestingBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
    mobileTestingBtn.addEventListener('click', toggleTestingDropdown);
  }

  /* ---- 5. Close Mobile Menu on Normal Link Click ---- */
  if (nav && mobileMenu && burger) {
    mobileMenu.addEventListener('click', function (e) {
      var targetLink = e.target.closest('a');
      // If it's a real navigation link (not a toggle button or nested trigger)
      if (targetLink && !targetLink.classList.contains('nav__mobile-trigger') && !targetLink.classList.contains('nav__mobile-nested-toggle')) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- 6. Desktop / Tablet Touch Dropdown Support ---- */
  var desktopDropTriggers = document.querySelectorAll('.nav__drop-trigger');
  desktopDropTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      var parentDropdown = trigger.closest('.nav__dropdown');
      if (parentDropdown && window.innerWidth > 820) {
        if (!parentDropdown.classList.contains('active')) {
          e.preventDefault();
          document.querySelectorAll('.nav__dropdown.active').forEach(function (d) {
            if (d !== parentDropdown) d.classList.remove('active');
          });
          parentDropdown.classList.add('active');
        }
      }
    });
  });

  // Close desktop active dropdown when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav__dropdown') && !e.target.closest('.nav__mobile')) {
      document.querySelectorAll('.nav__dropdown.active').forEach(function (d) {
        d.classList.remove('active');
      });
    }
  });

  
  // Close desktop active dropdown when clicking any mega-link
  document.querySelectorAll('.nav__drop-menu a').forEach(function(link) {
    link.addEventListener('click', function() {
      document.querySelectorAll('.nav__dropdown.active').forEach(function(d) {
        d.classList.remove('active');
      });
    });
  });

  /* ---- 7. FAQ Accordion: Single-Open + Category Filter ---- */
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

  /* ---- 8. Quote Form Validation + Success State ---- */
  var form = document.getElementById('quoteForm');
  if (form) {
    function setErr(field, on) { if (field) field.classList.toggle('err', on); }

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

  /* ---- 9. Scroll Reveal Animations ---- */
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
