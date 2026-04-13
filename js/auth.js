(function () {
    'use strict';

    var USERS_KEY = 'animehub_users';
    var SESSION_KEY = 'animehub_current_user';

    function getUsers() {
        return loadJSON(localStorage, USERS_KEY, {});
    }

    function saveUsers(users) {
        saveJSON(localStorage, USERS_KEY, users);
    }

    function getCurrentUser() {
        return sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY) || '';
    }

    function setCurrentUser(email, remember) {
        sessionStorage.setItem(SESSION_KEY, email);
        if (remember) {
            localStorage.setItem(SESSION_KEY, email);
        }
    }

    function clearCurrentUser() {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_KEY);
    }

    function getCurrentProfile() {
        var email = getCurrentUser();
        if (!email) {
            return null;
        }
        var users = getUsers();
        return users[email] || null;
    }

    function updateAccountButton() {
        var button = document.getElementById('accountButton');
        if (!button) return;
        var profile = getCurrentProfile();
        if (profile) {
            button.textContent = 'Sign out';
            button.classList.remove('btn-outline-light');
            button.classList.add('btn-light');
            button.setAttribute('aria-label', 'Sign out of your account');
        } else {
            button.textContent = 'Sign in';
            button.classList.remove('btn-light');
            button.classList.add('btn-outline-light');
            button.setAttribute('aria-label', 'Sign in to your account');
        }
    }

    function showAuthMessage(message, type) {
        var target = document.getElementById('authMessage');
        if (!target) return;
        target.textContent = message;
        target.className = 'alert mt-4';
        if (type === 'success') {
            target.classList.add('alert-success');
        } else if (type === 'error') {
            target.classList.add('alert-danger');
        } else {
            target.classList.add('alert-secondary');
        }
        target.classList.remove('d-none');
    }

    function clearAuthMessage() {
        var target = document.getElementById('authMessage');
        if (!target) return;
        target.textContent = '';
        target.className = 'alert d-none';
    }

    function redirectToHome() {
        window.location.href = 'index.html';
    }

    function signOut() {
        clearCurrentUser();
        updateAccountButton();
        if (window.location.pathname.split('/').pop() === 'login.html') {
            showAuthMessage('You have signed out successfully.', 'success');
        } else {
            window.location.reload();
        }
    }

    function handleAccountButtonClick() {
        var profile = getCurrentProfile();
        if (profile) {
            signOut();
        } else {
            window.location.href = 'login.html';
        }
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function renderAuthPanel() {
        var page = window.location.pathname.split('/').pop();
        if (page !== 'login.html') return;

        var profile = getCurrentProfile();
        var signedInState = document.getElementById('signedInState');
        var signInForm = document.getElementById('signInForm');
        var signUpForm = document.getElementById('signUpForm');

        if (profile) {
            if (signedInState) {
                signedInState.classList.remove('d-none');
                signedInState.querySelector('.user-name').textContent = profile.username || profile.name;
            }
            if (signInForm) signInForm.classList.add('d-none');
            if (signUpForm) signUpForm.classList.add('d-none');
            return;
        }

        if (signInForm) signInForm.classList.remove('d-none');
        if (signUpForm) signUpForm.classList.add('d-none');
        if (signedInState) signedInState.classList.add('d-none');
    }

    function switchAuthTab(tab) {
        var signInForm = document.getElementById('signInForm');
        var signUpForm = document.getElementById('signUpForm');
        var signInTab = document.getElementById('tabSignIn');
        var signUpTab = document.getElementById('tabSignUp');
        var authPanelTitle = document.getElementById('authPanelTitle');
        if (tab === 'signup') {
            if (signInForm) signInForm.classList.add('d-none');
            if (signUpForm) signUpForm.classList.remove('d-none');
            if (signInTab) signInTab.classList.remove('active');
            if (signUpTab) signUpTab.classList.add('active');
            if (authPanelTitle) authPanelTitle.textContent = 'Create an account';
        } else {
            if (signUpForm) signUpForm.classList.add('d-none');
            if (signInForm) signInForm.classList.remove('d-none');
            if (signUpTab) signUpTab.classList.remove('active');
            if (signInTab) signInTab.classList.add('active');
            if (authPanelTitle) authPanelTitle.textContent = 'Log in to your account';
        }
        clearAuthMessage();
    }

    function handleSignUpSubmit(event) {
        event.preventDefault();
        var nameInput = document.getElementById('signUpName');
        var usernameInput = document.getElementById('signUpUsername');
        var emailInput = document.getElementById('signUpEmail');
        var passwordInput = document.getElementById('signUpPassword');
        var confirmInput = document.getElementById('signUpConfirm');
        var rememberInput = document.getElementById('signUpRemember');

        if (!nameInput || !usernameInput || !emailInput || !passwordInput || !confirmInput) return;

        var name = nameInput.value.trim();
        var username = usernameInput.value.trim().toLowerCase();
        var email = emailInput.value.trim().toLowerCase();
        var password = passwordInput.value;
        var confirm = confirmInput.value;
        var remember = rememberInput && rememberInput.checked;

        if (name.length < 2) {
            showAuthMessage('Please enter a valid name with at least 2 characters.', 'error');
            return;
        }
        if (!username || username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
            showAuthMessage('Username must be at least 3 characters and use letters, numbers, or underscores.', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            showAuthMessage('Please enter a valid email address.', 'error');
            return;
        }
        if (password.length < 6) {
            showAuthMessage('Password must be at least 6 characters long.', 'error');
            return;
        }
        if (password !== confirm) {
            showAuthMessage('Passwords do not match.', 'error');
            return;
        }

        var users = getUsers();
        if (users[email]) {
            showAuthMessage('An account with that email already exists. Please sign in instead.', 'error');
            return;
        }
        if (Object.values(users).some(function (user) {
            return user.username === username;
        })) {
            showAuthMessage('That username is already taken. Please choose a different one.', 'error');
            return;
        }

        users[email] = {
            name: name,
            username: username,
            email: email,
            password: password
        };
        saveUsers(users);
        setCurrentUser(email, remember);
        updateAccountButton();
        showAuthMessage('Account created successfully. You are now signed in.', 'success');
        setTimeout(redirectToHome, 1200);
    }

    function handleSignInSubmit(event) {
        event.preventDefault();
        var usernameInput = document.getElementById('signInUsername');
        var emailInput = document.getElementById('signInEmail');
        var passwordInput = document.getElementById('signInPassword');
        var rememberInput = document.getElementById('signInRemember');

        if (!usernameInput || !emailInput || !passwordInput) return;

        var username = usernameInput.value.trim().toLowerCase();
        var email = emailInput.value.trim().toLowerCase();
        var password = passwordInput.value;
        var remember = rememberInput && rememberInput.checked;

        if (!username && !email) {
            showAuthMessage('Please enter your username or email.', 'error');
            return;
        }
        if (!password) {
            showAuthMessage('Please enter your password.', 'error');
            return;
        }

        var users = getUsers();
        var user = null;
        if (username) {
            user = Object.values(users).find(function (item) {
                return item.username === username;
            });
        }
        if (!user && email) {
            user = users[email] || Object.values(users).find(function (item) {
                return item.email === email;
            });
        }
        if (!user || user.password !== password) {
            showAuthMessage('Username, email, or password is incorrect.', 'error');
            return;
        }

        setCurrentUser(user.email, remember);
        updateAccountButton();
        showAuthMessage('Signed in successfully.', 'success');
        setTimeout(redirectToHome, 800);
    }

    document.addEventListener('DOMContentLoaded', function () {
        updateAccountButton();
        var accountButton = document.getElementById('accountButton');
        if (accountButton) {
            accountButton.addEventListener('click', handleAccountButtonClick);
        }

        renderAuthPanel();

        var signInForm = document.getElementById('signInForm');
        if (signInForm) {
            signInForm.addEventListener('submit', handleSignInSubmit);
        }

        var signUpForm = document.getElementById('signUpForm');
        if (signUpForm) {
            signUpForm.addEventListener('submit', handleSignUpSubmit);
        }

        var tabSignIn = document.getElementById('tabSignIn');
        var tabSignUp = document.getElementById('tabSignUp');
        if (tabSignIn) {
            tabSignIn.addEventListener('click', function () {
                switchAuthTab('signin');
            });
        }
        if (tabSignUp) {
            tabSignUp.addEventListener('click', function () {
                switchAuthTab('signup');
            });
        }

        var signinPromptButton = document.getElementById('signinPromptButton');
        if (signinPromptButton) {
            signinPromptButton.addEventListener('click', function () {
                switchAuthTab('signin');
                var signInTab = document.getElementById('tabSignIn');
                if (signInTab) {
                    signInTab.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }
    });
})();
