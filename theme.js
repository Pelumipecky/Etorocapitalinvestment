// Theme toggle with graceful initialization and prefers-color-scheme fallback
(function () {
    function updateIcon(toggle, bodyEl) {
        if (!toggle) return;
        const icon = toggle.querySelector('i');
        if (!icon) return;
        const isDark = bodyEl.classList.contains('dark-theme');
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        toggle.title = isDark ? 'Switch to light theme' : 'Switch to dark theme';
    }

    document.addEventListener('DOMContentLoaded', () => {
        const themeToggle = document.getElementById('theme-toggle');
        const body = document.body;

        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = stored || (prefersDark ? 'dark' : 'light');

        if (currentTheme === 'dark') {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }

        updateIcon(themeToggle, body);

        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            const theme = body.classList.contains('dark-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            updateIcon(themeToggle, body);
        });
    });
})();