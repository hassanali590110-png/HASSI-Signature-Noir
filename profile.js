// ====================================
// PROFILE PAGE - COMPLETE FIXED
// ====================================

console.log('✅ Profile JS Loaded!');

// ====================================
// LOAD PROFILE
// ====================================
function loadProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Get elements - with null check
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const memberSince = document.getElementById('memberSince');
    const fullName = document.getElementById('fullName');
    const emailAddress = document.getElementById('emailAddress');
    const phoneNumber = document.getElementById('phoneNumber');
    const userAddress = document.getElementById('userAddress');
    const orderCount = document.getElementById('orderCount');
    const cartItemCount = document.getElementById('cartItemCount');
    const wishlistCount = document.getElementById('wishlistCount');

    if (!user) {
        if (profileName) profileName.textContent = 'Guest';
        if (profileEmail) profileEmail.textContent = 'guest@example.com';
        if (memberSince) memberSince.textContent = 'Member since: Not logged in';
        if (fullName) fullName.value = '';
        if (emailAddress) emailAddress.value = '';
        return;
    }

    if (profileName) profileName.textContent = user.name || user.email;
    if (profileEmail) profileEmail.textContent = user.email || '';

    // Load saved profile data
    const profile = JSON.parse(localStorage.getItem('userProfile')) || {};
    if (fullName) fullName.value = profile.name || user.name || '';
    if (emailAddress) emailAddress.value = user.email || '';
    if (phoneNumber) phoneNumber.value = profile.phone || '';
    if (userAddress) userAddress.value = profile.address || '';

    // Member since
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(u => u.email === user.email);
    if (memberSince) {
        if (foundUser && foundUser.createdAt) {
            memberSince.textContent = 'Member since: ' + new Date(foundUser.createdAt).toLocaleDateString();
        } else {
            memberSince.textContent = 'Member since: ' + new Date().toLocaleDateString();
        }
    }

    // Stats
    if (orderCount) orderCount.textContent = orders.length;
    if (cartItemCount) cartItemCount.textContent = cart.length;
    if (wishlistCount) wishlistCount.textContent = wishlist.length;
}

// ====================================
// SAVE PROFILE
// ====================================
document.getElementById('profileForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('❌ Please login first!');
        window.location.href = 'login.html';
        return;
    }

    const fullName = document.getElementById('fullName');
    const phoneNumber = document.getElementById('phoneNumber');
    const userAddress = document.getElementById('userAddress');

    const profile = {
        name: fullName ? fullName.value.trim() : '',
        phone: phoneNumber ? phoneNumber.value.trim() : '',
        address: userAddress ? userAddress.value.trim() : ''
    };

    localStorage.setItem('userProfile', JSON.stringify(profile));

    // Update user name
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.email === user.email);
    if (index > -1) {
        users[index].name = profile.name || user.email;
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Update current user
    user.name = profile.name || user.email;
    localStorage.setItem('currentUser', JSON.stringify(user));

    alert('✅ Profile updated successfully!');
    loadProfile();
});

// ====================================
// LOGOUT
// ====================================
function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        alert('✅ Logged out successfully!');
        window.location.href = 'index.html';
    }
}

// ====================================
// CART FUNCTIONS
// ====================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function formatPrice(price) {
    return Number(price).toLocaleString('en-PK');
}

function updateCartUI() {
    const items = document.getElementById('cart-items');
    const total = document.getElementById('cart-total');
    const count = document.getElementById('cart-count');

    if (!items) return;

    let totalPrice = 0;
    if (cart.length === 0) {
        items.innerHTML = `<p style="color:#888; text-align:center; padding:40px 0;">Your cart is empty.</p>`;
    } else {
        items.innerHTML = '';
        cart.forEach((item, index) => {
            totalPrice += item.price;
            items.innerHTML += `
                <div style="display:flex; align-items:center; gap:15px; padding:12px 0; border-bottom:1px solid #333;">
                    <img src="${item.image || 'https://via.placeholder.com/60'}" style="width:60px; height:60px; object-fit:cover; border-radius:10px;">
                    <div style="flex:1;">
                        <h4 style="font-size:14px;">${item.name}</h4>
                        <p style="color:#d4af37; font-weight:600;">Rs. ${formatPrice(item.price)}</p>
                    </div>
                    <button onclick="removeFromCart(${index})" style="background:transparent; border:none; color:#ff4444; font-size:18px; cursor:pointer;">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            `;
        });
    }
    if (total) total.textContent = formatPrice(totalPrice);
    if (count) count.textContent = cart.length;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    loadProfile();
}

// ====================================
// CART TOGGLE
// ====================================
document.getElementById('cart-icon')?.addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('cart-sidebar')?.classList.add('active');
});

document.getElementById('close-cart')?.addEventListener('click', function () {
    document.getElementById('cart-sidebar')?.classList.remove('active');
});

// ====================================
// MOBILE MENU
// ====================================
document.getElementById('menuBtn')?.addEventListener('click', function () {
    document.getElementById('navMenu')?.classList.toggle('active');
});

// ====================================
// LOADER
// ====================================
window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    if (loader) setTimeout(() => loader.classList.add('hide'), 500);
    loadProfile();
    updateCartUI();
});

// ====================================
// MAKE FUNCTIONS GLOBAL
// ====================================
window.logoutUser = logoutUser;
window.loadProfile = loadProfile;
window.removeFromCart = removeFromCart;
window.updateCartUI = updateCartUI;

console.log('✅ Profile Page Loaded!');