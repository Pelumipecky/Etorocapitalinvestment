// contact.js — handle contact form submit and POST to backend API
(function () {
  function apiBase() {
    // If frontend is served from a web server where API sits at same origin, use ''.
    // For local dev where static site is file://, default to http://localhost:3000
    try {
      if (window && window.location && window.location.protocol === 'file:') return 'http://localhost:3000';
      return '';
    } catch (e) {
      return 'http://localhost:3000';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const btn = document.getElementById('contact-submit');
    if (!form) return;

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (!btn) return;

      const name = form.querySelector('#name')?.value || '';
      const email = form.querySelector('#email')?.value || '';
      const subject = form.querySelector('#subject')?.value || '';
      const message = form.querySelector('#message')?.value || '';
      const hp = form.querySelector('#hp')?.value || '';

      btn.disabled = true;
      btn.textContent = 'Sending...';

      try {
        const url = (apiBase() || '') + '/api/contact';
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message, hp })
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert('Failed to send message: ' + (err.error || res.statusText));
        } else {
          // success — show a quick message and reset form
          alert('Thanks — your message was sent. We will reply to ' + email + ' soon.');
          form.reset();
        }
      } catch (err) {
        console.error(err);
        alert('Network error: could not send message.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send Message';
      }
    });
  });
})();
