// ====================================
// HASSI SIGNATURE NOIR - COMPLETE
// ====================================

console.log('✅ Script Loaded!');

// ====================================
// PRODUCTS - SIRF EK PRODUCT
// ====================================
const products = [
    {
        id: 1,
        name: 'Rassasi Hawas Ice',
        price: 8500,
        category: 'Men',
        image: 'images/hawas-ice.jpg',
        stock: 10,
        desc: 'Premium luxury fragrance with fresh aquatic notes.'
    }
];

// ====================================
// CART
// ====================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ====================================
// FORMAT PRICE
// ====================================
function formatPrice(price) {
    return Number(price).toLocaleString('en-PK');
}

// ====================================
// DISPLAY PRODUCTS
// ====================================
function displayProducts(productsArray) {
    const container = document.getElementById('products-container');
    if (!container) return;

    if (productsArray.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:60px;"><h3>No Products Found</h3></div>`;
        return;
    }

    container.innerHTML = '';
    productsArray.forEach(product => {
        const stock = product.stock || 0;
        const stockColor = stock > 0 ? '#28a745' : '#ff4444';
        const stockText = stock > 0 ? '✓ In Stock' : '✗ Out of Stock';

        container.innerHTML += `
            <div class="product-card">
                <img src="${product.image || 'images/hawas-ice.jpg'}" alt="${product.name}" onerror="this.src='images/hawas-ice.jpg'">
                <h3>${product.name}</h3>
                <p class="price">Rs. ${formatPrice(product.price)}</p>
                <p style="color:${stockColor}; font-size:13px;">${stockText}</p>
                ${stock > 0 ? `
                    <button class="product-btn" onclick="addToCart(${product.id})">
                        <i class="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                ` : `
                    <button class="product-btn" style="background:#555; cursor:not-allowed;" disabled>
                        <i class="fa-solid fa-xmark"></i> Out of Stock
                    </button>
                `}
            </div>
        `;
    });
}

// ====================================
// LOAD PRODUCTS
// ====================================
function loadProducts() {
    displayProducts(products);
}

// ====================================
// ADD TO CART
// ====================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (product.stock <= 0) {
        alert('❌ Out of stock!');
        return;
    }
    cart.push({ ...product });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    alert(`✅ ${product.name} added to cart!`);
}

// ====================================
// REMOVE FROM CART
// ====================================
function removeFromCart(index) {
    const removed = cart[index];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    alert(`❌ ${removed.name} removed`);
}

// ====================================
// UPDATE CART UI
// ====================================
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
                    <img src="${item.image || 'images/hawas-ice.jpg'}" style="width:60px; height:60px; object-fit:cover; border-radius:10px;" onerror="this.src='images/hawas-ice.jpg'">
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

// ====================================
// SEARCH
// ====================================
document.getElementById('search-input')?.addEventListener('input', function () {
    const value = this.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(value));
    displayProducts(filtered);
});

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
// THEME TOGGLE
// ====================================
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const toggle = document.getElementById('themeToggle');
    const icon = toggle?.querySelector('i');

    if (currentTheme === 'light') {
        body.removeAttribute('data-theme');
        if (icon) icon.className = 'fa-regular fa-moon';
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        if (icon) icon.className = 'fa-regular fa-sun';
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    const toggle = document.getElementById('themeToggle');
    const icon = toggle?.querySelector('i');

    if (theme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        if (icon) icon.className = 'fa-regular fa-sun';
    } else {
        document.body.removeAttribute('data-theme');
        if (icon) icon.className = 'fa-regular fa-moon';
    }
}

// ====================================
// NEWSLETTER
// ====================================
document.getElementById('newsletterForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail')?.value.trim();
    if (!email) {
        alert('❌ Please enter your email');
        return;
    }
    if (!email.includes('@')) {
        alert('❌ Please enter a valid email');
        return;
    }
    let subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
    if (subscribers.find(s => s.email === email)) {
        alert('❌ Already subscribed!');
        return;
    }
    subscribers.push({ email, date: new Date().toLocaleDateString() });
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    alert('✅ Thank you for subscribing!');
    this.reset();
});

// ====================================
// LIVE CHAT SUPPORT
// ====================================

function openChat() {
    const modal = document.getElementById('chatModal');
    if (modal) {
        modal.classList.add('active');
        console.log('✅ Chat opened!');
    } else {
        console.error('❌ Chat modal not found!');
    }
}

function closeChat() {
    const modal = document.getElementById('chatModal');
    if (modal) {
        modal.classList.remove('active');
        console.log('✅ Chat closed!');
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input) {
        console.error('❌ Chat input not found!');
        return;
    }

    const message = input.value.trim();
    if (!message) return;

    const chatBody = document.getElementById('chatBody');
    if (!chatBody) {
        console.error('❌ Chat body not found!');
        return;
    }

    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.innerHTML = `
        <div class="chat-avatar">👤</div>
        <div class="chat-bubble">${escapeHTML(message)}</div>
    `;
    chatBody.appendChild(userMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
    input.value = '';

    // Typing indicator
    showTyping();

    // Auto reply
    setTimeout(() => {
        hideTyping();
        const reply = getAutoReply(message);
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message bot';
        botMsg.innerHTML = `
            <div class="chat-avatar">🤖</div>
            <div class="chat-bubble">${reply}</div>
        `;
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
        showQuickReplies();
    }, 1000);
}

function showTyping() {
    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return;

    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.id = 'typingIndicator';
    typing.innerHTML = `
        <span></span><span></span><span></span>
        <span style="color:#888; font-size:12px; margin-left:5px;">Bot is typing...</span>
    `;
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function hideTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

function showQuickReplies() {
    const chatBody = document.getElementById('chatBody');
    if (!chatBody) return;

    // Remove old quick replies
    const oldReplies = document.getElementById('quickReplies');
    if (oldReplies) oldReplies.remove();

    const replies = document.createElement('div');
    replies.className = 'quick-replies';
    replies.id = 'quickReplies';

    const options = [
        '📦 Track Order',
        '📞 Contact Support',
        '🛍️ Shop Now',
        '❓ FAQ',
        '✅ Done'
    ];

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply-btn';
        btn.textContent = opt;
        btn.onclick = function () {
            const input = document.getElementById('chatInput');
            if (input) {
                input.value = opt;
                sendMessage();
            }
            this.parentElement.remove();
        };
        replies.appendChild(btn);
    });

    chatBody.appendChild(replies);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function getAutoReply(message) {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('order') || lowerMsg.includes('track')) {
        return '📦 Track your order on our <a href="tracking.html" style="color:#d4af37; text-decoration:underline;">Track Order page</a>.';
    }
    if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
        return '💰 Our products start from Rs. 8,500. <a href="index.html#products" style="color:#d4af37; text-decoration:underline;">View all</a>.';
    }
    if (lowerMsg.includes('delivery') || lowerMsg.includes('shipping')) {
        return '🚚 Free delivery on orders above Rs. 5,000. Delivery takes 2-5 business days.';
    }
    if (lowerMsg.includes('contact') || lowerMsg.includes('support')) {
        return '📞 Contact us: hassanali590110@gmail.com | +92 332 3365097 | EasyPaisa: 0333-2944558';
    }
    if (lowerMsg.includes('faq') || lowerMsg.includes('question')) {
        return '❓ Visit our <a href="faq.html" style="color:#d4af37; text-decoration:underline;">FAQ page</a>.';
    }
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
        return 'Hello! 👋 How can I help you today?';
    }
    if (lowerMsg.includes('done') || lowerMsg.includes('thanks') || lowerMsg.includes('thank')) {
        return 'You\'re welcome! 😊 Have a great day! ✨';
    }
    return 'I\'m here to help! Ask about 📦 Orders, 🛍️ Products, 🚚 Delivery, or 📞 Contact info.';
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ====================================
// FILTER PRODUCTS
// ====================================
function filterProducts(category) {
    const filtered = products.filter(p => p.category === category);
    displayProducts(filtered);
}

// ====================================
// MAKE FUNCTIONS GLOBAL
// ====================================
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.filterProducts = filterProducts;
window.updateCartUI = updateCartUI;
window.toggleTheme = toggleTheme;
window.loadTheme = loadTheme;
window.openChat = openChat;
window.closeChat = closeChat;
window.sendMessage = sendMessage;

// ====================================
// LOADER
// ====================================
window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => loader.classList.add('hide'), 500);
    }
    loadProducts();
    updateCartUI();
    loadTheme();
    console.log('✅ HASSI Signature Noir Ready!');
    console.log(`📦 ${products.length} product loaded`);
    console.log(`🛒 ${cart.length} cart items`);
});