// ====================================
// WISHLIST PAGE - COMPLETE
// ====================================

console.log('✅ Wishlist JS Loaded!');

// ====================================
// FORMAT PRICE
// ====================================
function formatPrice(price) {
    return Number(price).toLocaleString('en-PK');
}

// ====================================
// LOAD WISHLIST
// ====================================
function loadWishlist() {
    const container = document.getElementById('wishlistContainer');
    const count = document.getElementById('wishlistCount');

    if (!container) return;

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="empty-wishlist" style="text-align:center; padding:60px 20px;">
                <i class="fa-regular fa-heart" style="font-size:70px; color:#d4af37;"></i>
                <h3 style="color:#fff; margin:20px 0 10px;">Your Wishlist is Empty</h3>
                <p style="color:#888;">Start adding your favorite perfumes to the wishlist!</p>
                <a href="index.html#products" class="btn-primary" style="display:inline-block; margin-top:20px; padding:14px 35px; background:#d4af37; color:#000; border-radius:30px; text-decoration:none; font-weight:600;">🛍️ Start Shopping</a>
            </div>
        `;
        if (count) count.textContent = '0 items in your wishlist';
        return;
    }

    if (count) count.textContent = `${wishlist.length} items in your wishlist`;

    let gridHTML = '<div class="wishlist-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(250px, 1fr)); gap:25px; margin-top:30px;">';

    wishlist.forEach((item, index) => {
        const stock = item.stock || 0;
        const inStock = stock > 0;
        const stockClass = inStock ? 'in-stock' : 'out-of-stock';
        const stockText = inStock ? `✅ In Stock (${stock} available)` : '❌ Out of Stock';

        gridHTML += `
            <div class="wishlist-card" style="background:#1a1a1a; border-radius:16px; padding:20px; text-align:center; transition:0.4s; border:1px solid transparent; position:relative;">
                <button class="remove-btn" onclick="removeFromWishlist(${index})" style="position:absolute; top:12px; right:12px; background:transparent; border:none; color:#ff4444; font-size:20px; cursor:pointer; transition:0.3s;">
                    <i class="fa-regular fa-heart"></i>
                </button>
                <img src="${item.image || 'https://via.placeholder.com/160'}" alt="${item.name}" style="width:100%; max-width:160px; height:160px; object-fit:contain; margin:0 auto;" onerror="this.src='https://via.placeholder.com/160/1a1a1a/d4af37?text=HASSI'">
                <h3 style="font-size:18px; color:#fff; margin:12px 0 5px;">${item.name}</h3>
                <p class="price" style="color:#d4af37; font-size:20px; font-weight:700;">Rs. ${formatPrice(item.price)}</p>
                <p class="stock-status ${stockClass}" style="font-size:13px; margin:5px 0; color:${inStock ? '#28a745' : '#ff4444'};">${stockText}</p>
                ${inStock ? `
                    <button class="add-to-cart-btn" onclick="addToCartFromWishlist(${index})" style="width:100%; padding:10px; background:#d4af37; color:#000; border:none; border-radius:30px; font-weight:600; cursor:pointer; margin-top:10px; transition:0.3s;">
                        🛒 Add to Cart
                    </button>
                ` : `
                    <button class="add-to-cart-btn" style="width:100%; padding:10px; background:#555; color:#fff; border:none; border-radius:30px; font-weight:600; cursor:not-allowed; margin-top:10px;" disabled>
                        Out of Stock
                    </button>
                `}
            </div>
        `;
    });

    gridHTML += '</div>';
    container.innerHTML = gridHTML;
}

// ====================================
// ADD TO CART FROM WISHLIST
// ====================================
function addToCartFromWishlist(index) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const item = wishlist[index];
    if (!item) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ ...item });
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart UI
    updateCartUI();

    alert(`✅ ${item.name} added to cart!`);

    // Update cart count
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.textContent = cart.length;
}

// ====================================
// REMOVE FROM WISHLIST
// ====================================
function removeFromWishlist(index) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const removed = wishlist[index];
    wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    loadWishlist();

    // Update wishlist count in navbar
    const wishlistCount = document.getElementById('wishlist-count');
    if (wishlistCount) wishlistCount.textContent = wishlist.length;

    alert(`❌ ${removed.name} removed from wishlist`);
}

// ====================================
// CLEAR WISHLIST
// ====================================
function clearWishlist() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (wishlist.length === 0) {
        alert('Your wishlist is already empty!');
        return;
    }

    if (confirm('Are you sure you want to clear your entire wishlist?')) {
        wishlist = [];
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        loadWishlist();

        const wishlistCount = document.getElementById('wishlist-count');
        if (wishlistCount) wishlistCount.textContent = 0;

        alert('🗑️ Wishlist cleared successfully!');
    }
}

// ====================================
// CART FUNCTIONS
// ====================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
    if (loader) setTimeout(() => loader.classList.add('hide'), 800);
    loadWishlist();
    updateCartUI();
});

// ====================================
// MAKE FUNCTIONS GLOBAL
// ====================================
window.loadWishlist = loadWishlist;
window.removeFromWishlist = removeFromWishlist;
window.addToCartFromWishlist = addToCartFromWishlist;
window.clearWishlist = clearWishlist;
window.removeFromCart = removeFromCart;
window.updateCartUI = updateCartUI;

console.log('✅ Wishlist Page Loaded!');