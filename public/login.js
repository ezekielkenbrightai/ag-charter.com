(function () {
    'use strict';

    // If already authenticated, go straight to dashboard
    if (sessionStorage.getItem('oag_authenticated') === '1') {
        window.location.replace('index.html');
        return;
    }

    var form = document.getElementById('login-form');
    var staffInput = document.getElementById('staff-id');
    var pwdInput = document.getElementById('password');
    var toggleBtn = document.getElementById('toggle-pwd');
    var errorBanner = document.getElementById('error-banner');
    var errorMessage = document.getElementById('error-message');
    var btnLogin = document.getElementById('btn-login');
    var btnText = btnLogin.querySelector('.btn-text');
    var btnLoader = btnLogin.querySelector('.btn-loader');

    // Demo credentials
    var VALID_USERS = [
        { id: 'admin', password: 'admin', name: 'Admin User', role: 'State Counsel' },
        { id: 'AG/2024/001', password: 'oag2024', name: 'Amina Wanjiku', role: 'Deputy Director' },
        { id: 'demo', password: 'demo', name: 'Demo User', role: 'Legal Officer' }
    ];

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

    // Form submission
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

        // Show loading state
        setLoading(true);

        // Simulate network delay for realism
        setTimeout(function () {
            var user = authenticate(staffId, password);
            if (user) {
                sessionStorage.setItem('oag_authenticated', '1');
                sessionStorage.setItem('oag_user', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                setLoading(false);
                showError('Invalid Staff ID or password. Please try again.');
                pwdInput.value = '';
                pwdInput.focus();
            }
        }, 800);
    });

    function authenticate(id, pwd) {
        var idLower = id.toLowerCase();
        for (var i = 0; i < VALID_USERS.length; i++) {
            if (VALID_USERS[i].id.toLowerCase() === idLower && VALID_USERS[i].password === pwd) {
                return { name: VALID_USERS[i].name, role: VALID_USERS[i].role };
            }
        }
        return null;
    }

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
