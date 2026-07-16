// ====================================
// LOGIN - COMPLETE
// ====================================

console.log('✅ Login JS Loaded!');

// ====================================
// LOGIN FORM
// ====================================
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const error = document.getElementById('loginError');

    // Clear previous error
    error.classList.remove('show');
    error.textContent = '';

    // Validation
    if (!email || !password) {
        error.textContent = '❌ Please fill all fields';
        error.classList.add('show');
        return;
    }

    if (!email.includes('@')) {
        error.textContent = '❌ Please enter a valid email';
        error.classList.add('show');
        return;
    }

    if (password.length < 6) {
        error.textContent = '❌ Password must be at least 6 characters';
        error.classList.add('show');
        return;
    }

    // Check user in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        error.textContent = '❌ Invalid email or password';
        error.classList.add('show');
        return;
    }

    // Save user session
    localStorage.setItem('currentUser', JSON.stringify({
        name: user.name || email.split('@')[0],
        email: user.email
    }));

    alert('✅ Login Successful! Welcome back!');
    window.location.href = 'index.html';
});