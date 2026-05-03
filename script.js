// script.js - Frontend JavaScript for Binance Clone

// Add event listeners to buttons
document.addEventListener('DOMContentLoaded', function() {
    // Get Started button
    const getStartedBtn = document.querySelector('.btn-warning[type="button"]:not([data-bs-toggle])');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            alert('Welcome to Binance! This is a demo.');
        });
    }

    // Sign up buttons
    const signUpBtns = document.querySelectorAll('.btn-warning');
    signUpBtns.forEach(btn => {
        if (btn.textContent.includes('Sign up') || btn.textContent.includes('Register')) {
            btn.addEventListener('click', function() {
                alert('Sign up functionality would be implemented here.');
            });
        }
    });

    // Log In button
    const logInBtn = document.querySelector('.btn-warning');
    if (logInBtn && logInBtn.textContent.includes('Log In')) {
        logInBtn.addEventListener('click', function() {
            alert('Log in functionality would be implemented here.');
        });
    }

    // Newsletter subscribe
    const subscribeBtn = document.querySelector('button[type="button"]:not(.btn-warning)');
    if (subscribeBtn && subscribeBtn.textContent === 'Subscribe') {
        subscribeBtn.addEventListener('click', function() {
            const emailInput = document.getElementById('newsletter1');
            if (emailInput && emailInput.value) {
                alert(`Thank you for subscribing with ${emailInput.value}!`);
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    console.log('Binance Clone JavaScript loaded successfully.');
});