(function () {
    'use strict';

    // If already authenticated (server session), go straight to dashboard
    fetch('/api/auth/me')
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
            if (data && data.user) window.location.replace('index.html');
        })
        .catch(function () { /* Not authenticated — stay on login */ });

    var form = document.getElementById('login-form');
    var staffInput = document.getElementById('staff-id');
    var pwdInput = document.getElementById('password');
    var toggleBtn = document.getElementById('toggle-pwd');
    var errorBanner = document.getElementById('error-banner');
    var errorMessage = document.getElementById('error-message');
    var btnLogin = document.getElementById('btn-login');
    var btnText = btnLogin.querySelector('.btn-text');
    var btnLoader = btnLogin.querySelector('.btn-loader');

    // Toggle password visibility
    toggleBtn.addEventListener('click', function () {
        var isPassword = pwdInput.type === 'password';
        pwdInput.type = isPassword ? 'text' : 'password';
        toggleBtn.textContent = isPassword ? '\u25CB' : '\u25C9';
        toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });

    // Clear field-level errors on input
    staffInput.addEventListener('input', function () {
        staffInput.closest('.input-wrapper').classList.remove('error');
        hideError();
    });
    pwdInput.addEventListener('input', function () {
        pwdInput.closest('.input-wrapper').classList.remove('error');
        hideError();
    });

    // Toggle demo accounts panel
    var demoToggle = document.getElementById('demo-toggle');
    var demoPanel = document.getElementById('demo-accounts');
    if (demoToggle && demoPanel) {
        demoToggle.addEventListener('click', function () {
            var isHidden = demoPanel.hidden;
            demoPanel.hidden = !isHidden;
            demoToggle.textContent = isHidden ? '\u25B2 Hide Demo Accounts' : '\u25BC Show Demo Accounts';
        });

        // Click-to-fill demo credentials
        demoPanel.addEventListener('click', function (e) {
            var row = e.target.closest('[data-staff-id]');
            if (row) {
                staffInput.value = row.getAttribute('data-staff-id');
                pwdInput.value = 'oag2025';
                staffInput.closest('.input-wrapper').classList.remove('error');
                pwdInput.closest('.input-wrapper').classList.remove('error');
                hideError();
            }
        });
    }

    // Form submission — calls the server API
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        hideError();

        var staffId = staffInput.value.trim();
        var password = pwdInput.value;

        // Validation
        if (!staffId) {
            showError('Please enter your Staff ID or email.');
            staffInput.closest('.input-wrapper').classList.add('error');
            staffInput.focus();
            return;
        }
        if (!password) {
            showError('Please enter your password.');
            pwdInput.closest('.input-wrapper').classList.add('error');
            pwdInput.focus();
            return;
        }

        setLoading(true);

        fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ staff_id: staffId, password: password })
        })
        .then(function (res) {
            return res.json().then(function (data) {
                return { ok: res.ok, data: data };
            });
        })
        .then(function (result) {
            if (result.ok && result.data.success) {
                // Server session is now active — redirect
                window.location.href = 'index.html';
            } else {
                setLoading(false);
                showError(result.data.error || 'Login failed. Please try again.');
                pwdInput.value = '';
                pwdInput.focus();
            }
        })
        .catch(function () {
            setLoading(false);
            showError('Network error. Please check your connection and try again.');
        });
    });

    function showError(msg) {
        errorMessage.textContent = msg;
        errorBanner.hidden = false;
    }

    function hideError() {
        errorBanner.hidden = true;
    }

    function setLoading(on) {
        btnLogin.disabled = on;
        btnText.textContent = on ? 'Signing in...' : 'Sign In';
        btnLoader.hidden = !on;
    }
})();
