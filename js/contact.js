(function () {
  'use strict';

  var COOKIE_NAME = 'animehub_contact';
  var COOKIE_DAYS = 90;

  function parseCookieContact() {
    var raw = typeof getCookie === 'function' ? getCookie(COOKIE_NAME) : '';
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function writeCookieContact(name, email) {
    if (typeof setCookie !== 'function') return;
    setCookie(COOKIE_NAME, JSON.stringify({ name: name, email: email }), COOKIE_DAYS);
  }

  function clearCookieContact() {
    if (typeof deleteCookie === 'function') deleteCookie(COOKIE_NAME);
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contactForm');
    var nameEl = document.getElementById('contactName');
    var emailEl = document.getElementById('contactEmail');
    var remember = document.getElementById('rememberMe');
    var errBox = document.getElementById('formErrors');
    var success = document.getElementById('contactSuccess');

    var saved = parseCookieContact();
    if (saved && nameEl && emailEl) {
      nameEl.value = saved.name || '';
      emailEl.value = saved.email || '';
      if (remember) remember.checked = true;
    }

    if (!form) return;

    var messageCount = document.getElementById('messageCount');
    var messageEl = document.getElementById('contactMessage');
    if (messageEl && messageCount) {
      messageEl.addEventListener('input', function () {
        messageCount.textContent = messageEl.value.length + ' / 500';
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (errBox) {
        errBox.classList.add('d-none');
        errBox.textContent = '';
      }
      if (success) success.classList.add('d-none');

      var name = nameEl ? nameEl.value.trim() : '';
      var email = emailEl ? emailEl.value.trim() : '';
      var subject = document.getElementById('contactSubject')
        ? document.getElementById('contactSubject').value.trim()
        : '';
      var message = messageEl ? messageEl.value.trim() : '';
      var policyEl = document.getElementById('agreePolicy');
      var policyChecked = policyEl ? policyEl.checked : false;

      var ok = true;
      var messages = [];

      if (name.length < 2) {
        ok = false;
        messages.push('Name needs at least 2 characters.');
        if (nameEl) {
          nameEl.setAttribute('aria-invalid', 'true');
          nameEl.classList.add('is-invalid');
        }
      } else if (nameEl) {
        nameEl.setAttribute('aria-invalid', 'false');
        nameEl.classList.remove('is-invalid');
        nameEl.classList.add('is-valid');
      }

      if (!isValidEmail(email)) {
        ok = false;
        messages.push('Enter a valid email.');
        if (emailEl) {
          emailEl.setAttribute('aria-invalid', 'true');
          emailEl.classList.add('is-invalid');
        }
      } else if (emailEl) {
        emailEl.setAttribute('aria-invalid', 'false');
        emailEl.classList.remove('is-invalid');
        emailEl.classList.add('is-valid');
      }

      var subEl = document.getElementById('contactSubject');
      if (!subject) {
        ok = false;
        messages.push('Please choose a subject.');
        if (subEl) {
          subEl.setAttribute('aria-invalid', 'true');
          subEl.classList.add('is-invalid');
        }
      } else if (subEl) {
        subEl.setAttribute('aria-invalid', 'false');
        subEl.classList.remove('is-invalid');
        subEl.classList.add('is-valid');
      }

      if (message.length < 10) {
        ok = false;
        messages.push('Message should be at least 10 characters.');
        if (messageEl) {
          messageEl.setAttribute('aria-invalid', 'true');
          messageEl.classList.add('is-invalid');
        }
      } else if (messageEl) {
        messageEl.setAttribute('aria-invalid', 'false');
        messageEl.classList.remove('is-invalid');
        messageEl.classList.add('is-valid');
      }

      if (!policyChecked) {
        ok = false;
        messages.push('You must agree to the Privacy Policy and Terms of Use.');
        if (policyEl) {
          policyEl.classList.add('is-invalid');
        }
      } else if (policyEl) {
        policyEl.classList.remove('is-invalid');
      }

      if (!form.checkValidity()) {
        ok = false;
        form.classList.add('was-validated');
      }

      if (!ok) {
        if (errBox && messages.length) {
          errBox.textContent = messages.join(' ');
          errBox.classList.remove('d-none');
        }
        return;
      }

      form.classList.add('was-validated');

      if (remember && remember.checked) {
        writeCookieContact(name, email);
      } else {
        clearCookieContact();
      }

      if (success) success.classList.remove('d-none');
    });
  });
})();
