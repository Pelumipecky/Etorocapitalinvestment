// signup.js - JavaScript for sign-up form

// Signup now proxied through server API -> POST /api/signup

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthBars = passwordStrength.querySelectorAll('.strength-bar');

    // Password toggle
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Password strength indicator
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        strengthBars.forEach((bar, index) => {
            if (index < strength) {
                bar.classList.add('active');
            } else {
                bar.classList.remove('active');
            }
        });
    });

    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;

        // Basic validation
        if (!email) {
            alert('Please enter your email.');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (!terms) {
            alert('Please agree to the Terms of Service and Privacy Policy.');
            return;
        }

        // Proxy sign-up to backend (server will create user using Supabase service_role key)
        try {
            const resp = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, full_name: '', username: '' })
            });
            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                alert('Sign-up failed: ' + (err.error || resp.statusText));
                return;
            }
            alert('Sign-up successful! You can now log in.');
            window.location.href = 'login.html';
        } catch (err) {
            console.error('Sign-up failed', err);
            alert('Sign-up failed. See console for details.');
        }
    });
});