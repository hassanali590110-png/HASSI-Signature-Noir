// ====================================
// CONTACT PAGE - COMPLETE
// ====================================

console.log('✅ Contact JS Loaded!');

// ====================================
// CONTACT FORM
// ====================================
document.getElementById('contactForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
        alert('❌ Please fill all required fields!');
        return;
    }

    // Save to localStorage
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts.push({
        name: name,
        email: email,
        subject: subject || 'General',
        message: message,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    });
    localStorage.setItem('contacts', JSON.stringify(contacts));

    // Show success
    document.getElementById('successMsg').classList.add('show');
    this.reset();

    setTimeout(() => {
        document.getElementById('successMsg').classList.remove('show');
    }, 5000);
});

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
    updateCartUI();
});

console.log('✅ Contact Page Loaded!');