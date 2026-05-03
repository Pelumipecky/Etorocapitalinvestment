// dashboard.js - lightweight auth gate for the dashboard view

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  const redirectToLogin = () => {
    const pathname = window.location.pathname.replace(/^\/+/, '') || 'dashboard.html';
    const query = `?redirect=${encodeURIComponent(pathname)}`;
    window.location.replace(`login.html${query}`);
  };

  try {
    const sessionRaw = localStorage.getItem('ciphervault_session');
    if (!sessionRaw) {
      redirectToLogin();
      return;
    }

    const session = JSON.parse(sessionRaw);
    if (!session || typeof session !== 'object') {
      redirectToLogin();
      return;
    }

    body.classList.remove('auth-checking');
    body.classList.add('auth-ready');
  } catch (error) {
    console.error('Failed to validate session, redirecting to login.', error);
    redirectToLogin();
  }
});
