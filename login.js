// login.js - JavaScript for login form

// Login proxied through server API -> POST /api/login

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const rememberInput = document.getElementById('remember');
    const errorAlert = document.getElementById('loginError');
    const redirectParam = new URLSearchParams(window.location.search).get('redirect');
    const allowedRedirects = ['dashboard.html', 'index.html', 'packages.html'];
    const sanitizeRedirect = (target) => {
        if (!target) return 'dashboard.html';
        if (target.includes('://') || target.startsWith('//')) return 'dashboard.html';
        if (allowedRedirects.includes(target)) return target;
        return 'dashboard.html';
    };
    const nextLocation = sanitizeRedirect(redirectParam);

    // Password toggle
    togglePassword.addEventListener('click', function() {
        const showing = passwordInput.getAttribute('type') !== 'password';
        const nextType = showing ? 'password' : 'text';
        passwordInput.setAttribute('type', nextType);
        this.setAttribute('aria-pressed', String(!showing));
        this.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');

        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye', showing);
        icon.classList.toggle('fa-eye-slash', !showing);
    });

    const showError = (message) => {
        if (!errorAlert) {
            alert(message);
            return;
        }
        errorAlert.textContent = message;
        errorAlert.classList.remove('d-none');
    };

    const clearError = () => {
        if (errorAlert) {
            errorAlert.classList.add('d-none');
            errorAlert.textContent = '';
        }
    };

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = rememberInput?.checked || false;

        clearError();

        // Basic validation
        if (!email) {
            showError('Please enter your email.');
            return;
        }

        if (!password) {
            showError('Please enter your password.');
            return;
        }

        try {
            const resp = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, remember })
            });

            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                showError('Login failed: ' + (err.error || resp.statusText));
                return;
            }

            const payload = await resp.json();
            // In production you may want to set a secure, httpOnly cookie from server rather
            // than returning tokens to the browser. For now we store a simple flag and redirect.
            localStorage.setItem('ciphervault_session', JSON.stringify(payload.session || {}));
            alert('Login successful!');
            window.location.href = nextLocation;
        } catch (err) {
            console.error('Login error', err);
            showError('Login failed — check console for details');
        }
    });
});