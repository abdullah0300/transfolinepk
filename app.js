/* TransfoLine — Interactions & Navigation System (Robust for Desktop, Tablet & Mobile) */
(function () {
  'use strict';

  /* ---- DOM Elements ---- */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');

  /* ---- 1. Mobile Menu (Hamburger) Toggle ---- */
  if (nav && burger) {
    burger.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('nav-lock', isOpen);
    });
  }

  /* ---- 2. Mobile Menu Accordions (Event Delegation) ---- */
  if (mobileMenu) {
    mobileMenu.addEventListener('click', function (e) {
      // 1. Services Main Trigger
      var servicesBtn = e.target.closest('#mobileServicesBtn, .nav__mobile-trigger');
      if (servicesBtn) {
        e.preventDefault();
        e.stopPropagation();
        var servicesMenu = document.getElementById('mobileServicesMenu') || servicesBtn.nextElementSibling;
        if (servicesMenu) {
          var isExpanded = servicesMenu.classList.toggle('open');
          servicesBtn.classList.toggle('open', isExpanded);
          servicesBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        }
        return;
      }

      // 2. Nested Subgroup Toggles (Solar, Transformers, Testing)
      var nestedToggle = e.target.closest('.nav__mobile-nested-toggle');
      if (nestedToggle) {
        e.preventDefault();
        e.stopPropagation();
        var parentGroup = nestedToggle.closest('.nav__mobile-sub-group');
        var nestedMenu = parentGroup ? parentGroup.querySelector('.nav__mobile-nested') : null;
        
        if (!nestedMenu && nestedToggle.id) {
          if (nestedToggle.id === 'mobileSolarBtn') nestedMenu = document.getElementById('mobileSolarMenu');
          if (nestedToggle.id === 'mobileTransformersBtn') nestedMenu = document.getElementById('mobileTransformersMenu');
          if (nestedToggle.id === 'mobileTestingBtn') nestedMenu = document.getElementById('mobileTestingMenu');
        }

        if (nestedMenu) {
          var isNestedOpen = nestedMenu.classList.toggle('open');
          nestedToggle.classList.toggle('open', isNestedOpen);
          nestedToggle.setAttribute('aria-expanded', isNestedOpen ? 'true' : 'false');
        }
        return;
      }

      // 3. Normal navigation link clicked -> Close mobile menu
      var link = e.target.closest('a');
      if (link && !link.classList.contains('nav__mobile-trigger') && !link.classList.contains('nav__mobile-nested-toggle')) {
        nav.classList.remove('open');
        if (burger) burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-lock');
      }
    });
  }

  // Close when clicking outside of nav
  document.addEventListener('click', function (e) {
    if (nav && nav.classList.contains('open')) {
      if (!nav.contains(e.target)) {
        nav.classList.remove('open');
        if (burger) burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-lock');
      }
    }
  });

  /* ---- 3. Desktop / Tablet Touch Dropdown Support ---- */
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

  /* ---- 4. FAQ Accordion: Single-Open + Category Filter ---- */
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

  /* ---- 5. Quote Form Validation + Success State ---- */
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

  /* ---- 6. Scroll Reveal Animations ---- */
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
