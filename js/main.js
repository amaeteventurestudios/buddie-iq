/**
 * ============================================================
 * BUDDIE IQ — MAIN.JS
 * Vanilla JS. No frameworks. No build tools.
 * Works as a local file and on Vercel.
 * ============================================================
 */

(function () {
  'use strict';

  /* ============================================================
     UTILITY HELPERS
  ============================================================ */

  /**
   * querySelector shorthand
   * @param {string} selector
   * @param {Element} [context=document]
   * @returns {Element|null}
   */
  function qs(selector, context) {
    return (context || document).querySelector(selector);
  }

  /**
   * querySelectorAll shorthand → Array
   * @param {string} selector
   * @param {Element} [context=document]
   * @returns {Element[]}
   */
  function qsa(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  /**
   * Validate email format
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  /* ============================================================
     1. STICKY NAVIGATION
     Adds `.scrolled` class after 40px scroll.
     Removes it when back at top.
  ============================================================ */
  (function initStickyNav() {
    var nav = qs('#site-nav');
    if (!nav) return;

    var SCROLL_THRESHOLD = 40;

    function updateNav() {
      if (window.scrollY > SCROLL_THRESHOLD) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    // Run on load
    updateNav();

    // Throttle scroll handler
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateNav();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  })();

  /* ============================================================
     2. MOBILE NAV TOGGLE
  ============================================================ */
  (function initMobileNav() {
    var toggle = qs('#nav-mobile-toggle');
    var menu   = qs('#nav-mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      menu.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close when a mobile link is tapped
    qsa('.nav-mobile-link', menu).forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
      });
    });
  })();

  /* ============================================================
     3. SCROLL REVEAL
     Uses IntersectionObserver.
     Also checks on load if elements already in viewport.
     Falls back gracefully if IO not supported.
  ============================================================ */
  (function initScrollReveal() {
    var elements = qsa('.reveal');
    if (!elements.length) return;

    function reveal(el) {
      el.classList.add('visible');
    }

    // Immediately reveal elements already in viewport
    function checkInitial() {
      elements.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          reveal(el);
        }
      });
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              reveal(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
      );

      elements.forEach(function (el) {
        observer.observe(el);
      });

      // Check initial state after observer setup
      checkInitial();
    } else {
      // Fallback: reveal everything immediately
      elements.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  })();

  /* ============================================================
     4. ANIMATED COUNTER
     Finds elements with class .counter-value and data-target.
     Animates from 0 to target when element enters viewport.
     Uses requestAnimationFrame for smooth animation.
  ============================================================ */
  (function initCounter() {
    var counters = qsa('.counter-value[data-target]');
    if (!counters.length) return;

    var DURATION = 1800; // ms

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      if (el.dataset.animated) return;
      el.dataset.animated = 'true';

      var start = null;
      var startValue = 0;

      function step(timestamp) {
        if (!start) start = timestamp;
        var elapsed = timestamp - start;
        var progress = Math.min(elapsed / DURATION, 1);
        var eased = easeOutQuart(progress);
        var current = Math.round(startValue + (target - startValue) * eased);
        el.textContent = current.toLocaleString();

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString();
        }
      }

      window.requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach(function (el) { obs.observe(el); });
    } else {
      counters.forEach(function (el) {
        el.textContent = parseInt(el.getAttribute('data-target'), 10).toLocaleString();
      });
    }
  })();

  /* ============================================================
     5. SIGNUP TAB SWITCHING
     Toggle between "Reserve Spot" and "Free Waitlist" panels.
  ============================================================ */
  (function initSignupTabs() {
    var tabBtns  = qsa('.signup-tab');
    var panels   = qsa('.signup-panel');
    if (!tabBtns.length || !panels.length) return;

    // Map tab id → panel id
    var TAB_PANEL_MAP = {
      'tab-preorder': 'panel-preorder',
      'tab-waitlist': 'panel-waitlist',
    };

    // Handle "Just keep me updated" hero button → open waitlist tab
    var heroNotify = qs('#hero-notify-btn');
    if (heroNotify) {
      heroNotify.addEventListener('click', function (e) {
        e.preventDefault();
        activateTab('tab-waitlist');
        // Scroll to signup
        var signupSection = qs('#signup');
        if (signupSection) {
          signupSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    function activateTab(tabId) {
      tabBtns.forEach(function (btn) {
        var isActive = btn.id === tabId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
      });

      panels.forEach(function (panel) {
        var targetPanelId = TAB_PANEL_MAP[tabId];
        var isActive = panel.id === targetPanelId;
        panel.classList.toggle('hidden', !isActive);
        panel.setAttribute('aria-hidden', String(!isActive));
      });
    }

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activateTab(btn.id);
      });
    });
  })();

  /* ============================================================
     6. FAQ ACCORDION
     One item open at a time.
     Smooth max-height transition via CSS.
  ============================================================ */
  (function initFAQ() {
    var faqItems = qsa('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var question = qs('.faq-question', item);
      var answer   = qs('.faq-answer', item);
      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isExpanded = question.getAttribute('aria-expanded') === 'true';

        // Close all other items first
        faqItems.forEach(function (otherItem) {
          if (otherItem === item) return;
          var otherQ = qs('.faq-question', otherItem);
          var otherA = qs('.faq-answer', otherItem);
          if (!otherQ || !otherA) return;
          otherQ.setAttribute('aria-expanded', 'false');
          otherA.setAttribute('hidden', '');
        });

        // Toggle current
        if (isExpanded) {
          question.setAttribute('aria-expanded', 'false');
          answer.setAttribute('hidden', '');
        } else {
          question.setAttribute('aria-expanded', 'true');
          answer.removeAttribute('hidden');
        }
      });
    });
  })();

  /* ============================================================
     7. FORM VALIDATION & SUBMISSION
     Pre-order form + Waitlist form.
  ============================================================ */

  /**
   * Show field-level error
   */
  function showError(input, message) {
    input.classList.add('error');
    var errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.textContent = message;
  }

  /**
   * Clear field-level error
   */
  function clearError(input) {
    input.classList.remove('error');
    var errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.textContent = '';
  }

  /**
   * Hide form, show success state
   */
  function showSuccess(formEl, successEl) {
    formEl.setAttribute('hidden', '');
    successEl.removeAttribute('hidden');
  }

  /* ---- Pre-order Form ---- */
  (function initPreorderForm() {
    var form       = qs('#form-preorder');
    var successEl  = qs('#success-preorder');
    if (!form || !successEl) return;

    var nameInput  = qs('#preorder-name', form);
    var emailInput = qs('#preorder-email', form);

    // Clear errors on input
    [nameInput, emailInput].forEach(function (input) {
      if (!input) return;
      input.addEventListener('input', function () { clearError(input); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var valid = true;

      // Validate name
      if (!nameInput || nameInput.value.trim() === '') {
        showError(nameInput, 'Please enter your first name.');
        valid = false;
      }

      // Validate email
      if (!emailInput || !isValidEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address.');
        valid = false;
      }

      if (!valid) return;

      // Stripe Checkout integration
      var nameVal  = nameInput.value.trim();
      var emailVal = emailInput.value.trim();

      var submitBtn = form.querySelector('button[type="submit"], .btn-submit');
      if (submitBtn) {
        submitBtn.textContent = 'Redirecting to payment…';
        submitBtn.disabled = true;
      }

      // Redirect to Stripe Payment Link (pre-fill email for convenience)
      var paymentLink = 'https://buy.stripe.com/test_14A4gyccbdby287bHy1RC00';
      var successUrl  = window.location.origin + window.location.pathname + '?success=true';
      var cancelUrl   = window.location.origin + window.location.pathname + '?canceled=true';
      var checkoutUrl = paymentLink
        + '?prefilled_email=' + encodeURIComponent(emailVal)
        + '&success_url='     + encodeURIComponent(successUrl)
        + '&cancel_url='      + encodeURIComponent(cancelUrl);

      window.location.href = checkoutUrl;
    });
  })();

  /* ---- Waitlist Form ---- */
  (function initWaitlistForm() {
    var form      = qs('#form-waitlist');
    var successEl = qs('#success-waitlist');
    if (!form || !successEl) return;

    var emailInput = qs('#waitlist-email', form);

    if (emailInput) {
      emailInput.addEventListener('input', function () { clearError(emailInput); });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!emailInput || !isValidEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address.');
        return;
      }

      /*
       * ──────────────────────────────────────────────────
       * EMAIL MARKETING INTEGRATION POINT
       * ──────────────────────────────────────────────────
       * Replace the simulated submission below with your
       * email provider's API call.
       *
       * Option A — ConvertKit (requires API key on backend):
       *   await fetch('/api/subscribe', {
       *     method: 'POST',
       *     headers: { 'Content-Type': 'application/json' },
       *     body: JSON.stringify({ email: emailInput.value.trim() })
       *   });
       *   // Your /api/subscribe Vercel Edge Function calls:
       *   // https://api.convertkit.com/v3/forms/{FORM_ID}/subscribe
       *   // with api_key and email in the body.
       *
       * Option B — Mailchimp embedded form:
       *   Replace <form> action with your Mailchimp list action URL.
       *   Change method to POST. Add hidden fields as per Mailchimp.
       *
       * Option C — Use our Table API (no backend needed):
       *   fetch('tables/waitlist', {
       *     method: 'POST',
       *     headers: { 'Content-Type': 'application/json' },
       *     body: JSON.stringify({ email: emailInput.value.trim() })
       *   });
       * ──────────────────────────────────────────────────
       */

      var submitBtn = form.querySelector('.btn-submit');
      if (submitBtn) {
        submitBtn.textContent = 'Joining…';
        submitBtn.disabled = true;
      }

      // Simulate async — replace with real integration above
      setTimeout(function () {
        showSuccess(form, successEl);
      }, 700);
    });
  })();

  /* ============================================================
     8. FOOTER NEWSLETTER FORM
  ============================================================ */
  (function initFooterForm() {
    var form     = qs('#footer-form');
    var feedback = qs('#footer-form-feedback');
    if (!form || !feedback) return;

    var emailInput = qs('#footer-email', form);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!emailInput || !isValidEmail(emailInput.value)) {
        feedback.style.color = '#f08080';
        feedback.textContent = 'Please enter a valid email address.';
        if (emailInput) emailInput.focus();
        return;
      }

      /*
       * FOOTER EMAIL INTEGRATION POINT
       * Same as Waitlist — connect to ConvertKit / Mailchimp / Table API here.
       */

      var submitBtn = form.querySelector('.footer-submit');
      if (submitBtn) submitBtn.disabled = true;

      // Simulate async
      setTimeout(function () {
        feedback.style.color = '';
        feedback.textContent = '✓ You\'re on the list.';
        if (emailInput) emailInput.value = '';
        if (submitBtn) submitBtn.disabled = false;

        // Clear confirmation after 5 seconds
        setTimeout(function () {
          feedback.textContent = '';
        }, 5000);
      }, 600);
    });
  })();

  /* ============================================================
     10. SMOOTH SCROLL FOR ANCHOR LINKS
     Offsets for sticky nav height.
  ============================================================ */
  (function initSmoothScroll() {
    var navHeight = 68; // matches --nav-h CSS variable

    document.addEventListener('click', function (e) {
      var anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      var href = anchor.getAttribute('href');
      if (href === '#' || href === '#!') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      var targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  })();

  /* ============================================================
     11. STAGGER HOW-IT-WORKS CARDS
     Overrides base reveal timing to stagger on entry.
  ============================================================ */
  (function staggerHowCards() {
    var cards = qsa('.how-card');
    cards.forEach(function (card, i) {
      card.style.transitionDelay = (i * 100) + 'ms';
    });
  })();

  /* ============================================================
     12. STAGGER FAQ ITEMS
  ============================================================ */
  (function staggerFaqItems() {
    var items = qsa('.faq-item');
    items.forEach(function (item, i) {
      item.style.transitionDelay = (i * 50) + 'ms';
    });
  })();

  /* ============================================================
     13. NAV ACTIVE LINK HIGHLIGHTING
     Highlights nav links based on scroll position using
     IntersectionObserver on section elements.
  ============================================================ */
  (function initActiveNav() {
    var sections = qsa('section[id]');
    var navLinks = qsa('.nav-link');
    if (!sections.length || !navLinks.length) return;

    var current = '';

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            current = entry.target.id;
          }
        });

        navLinks.forEach(function (link) {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active-link');
          }
        });
      },
      {
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach(function (section) {
      obs.observe(section);
    });
  })();

  /* ============================================================
     14. PREFERS-REDUCED-MOTION GUARD
     If user has reduced motion preference, disable animations.
  ============================================================ */
  (function respectReducedMotion() {
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq && mq.matches) {
      // Immediately reveal all animated elements
      qsa('.reveal').forEach(function (el) {
        el.classList.add('visible');
        el.style.transitionDelay = '0ms';
      });
    }
  })();

  /* ============================================================
     15. STRIPE CHECKOUT SUCCESS/CANCEL HANDLER
     Handles redirect from Stripe after payment attempt.
  ============================================================ */
  (function handleStripeRedirect() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      var preorderForm    = document.getElementById('form-preorder') || document.getElementById('preorder-form');
      var preorderSuccess = document.getElementById('success-preorder') || document.getElementById('preorder-success');
      if (preorderForm)    preorderForm.style.display = 'none';
      if (preorderSuccess) preorderSuccess.style.display = 'block';
      var signup = document.getElementById('signup');
      if (signup) signup.scrollIntoView({ behavior: 'smooth' });
    }
    if (params.get('canceled') === 'true') {
      var submitBtn = document.querySelector('#form-preorder .btn-submit, #preorder-form .btn-submit');
      if (submitBtn) {
        submitBtn.textContent = 'Reserve My Spot — $20';
        submitBtn.disabled = false;
      }
    }
  })();

})();
