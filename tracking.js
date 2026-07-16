// ====================================
// TRACKING PAGE - COMPLETE
// ====================================

console.log('✅ Tracking JS Loaded!');

// ====================================
// FORMAT PRICE
// ====================================
function formatPrice(price) {
    return Number(price).toLocaleString('en-PK');
}

// ====================================
// GET STATUS LABEL
// ====================================
function getStatusLabel(status) {
    const labels = {
        'processing': 'Processing',
        'shipped': 'Shipped',
        'delivered': 'Delivered',
        'cancelled': 'Cancelled'
    };
    return labels[status] || status;
}

// ====================================
// GET STATUS ICON
// ====================================
function getStatusIcon(status) {
    const icons = {
        'processing': 'fa-regular fa-clock',
        'shipped': 'fa-solid fa-truck-fast',
        'delivered': 'fa-regular fa-circle-check',
        'cancelled': 'fa-regular fa-circle-xmark'
    };
    return icons[status] || 'fa-regular fa-clock';
}

// ====================================
// GET STATUS STEPS
// ====================================
function getStatusSteps(status) {
    const steps = ['processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(status);

    if (status === 'cancelled') {
        return ['processing', 'cancelled'];
    }

    return steps.map((step, index) => ({
        name: step,
        label: getStatusLabel(step),
        active: index <= currentIndex,
        done: index < currentIndex,
        icon: index <= currentIndex ? 'fa-solid fa-check' : 'fa-regular fa-circle'
    }));
}

// ====================================
// TRACK ORDER
// ====================================
function trackOrder() {
    const input = document.getElementById('orderIdInput');
    const orderId = input.value.trim().toUpperCase();
    const loading = document.getElementById('loadingSpinner');
    const notFound = document.getElementById('notFound');
    const details = document.getElementById('orderDetails');

    // Reset
    notFound.classList.remove('show');
    details.classList.remove('show');
    details.innerHTML = '';

    if (!orderId) {
        alert('❌ Please enter your Order ID');
        return;
    }

    // Show loading
    loading.classList.add('show');

    // Search in localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    let order = orders.find(o => o.id === orderId || o.id === orderId.toUpperCase());

    setTimeout(() => {
        loading.classList.remove('show');

        if (order) {
            displayOrder(order);
        } else {
            notFound.classList.add('show');
        }
    }, 500);
}

// ====================================
// DISPLAY ORDER
// ====================================
function displayOrder(order) {
    const details = document.getElementById('orderDetails');
    const status = order.status || 'processing';

    // Get status steps
    const steps = getStatusSteps(status);

    // Build status bar
    let stepsHTML = '';

    steps.forEach((step, index) => {
        const isActive = step.active;
        const isDone = step.done;
        const circleClass = isDone ? 'done' : (isActive ? 'active' : '');
        const labelClass = isDone ? 'done' : (isActive ? 'active' : '');

        stepsHTML += `
            <div class="step">
                <div class="circle ${circleClass}">
                    ${isDone ? '<i class="fa-solid fa-check"></i>' : (isActive ? step.icon : '<i class="fa-regular fa-circle"></i>')}
                </div>
                <div class="label ${labelClass}">${step.label}</div>
            </div>
        `;
    });

    // Calculate progress
    const progressMap = { 'processing': 33, 'shipped': 66, 'delivered': 100, 'cancelled': 33 };
    const progress = progressMap[status] || 0;

    // Build items list
    let itemsHTML = '';
    if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
            itemsHTML += `
                <div class="item-row" style="display:flex; align-items:center; gap:12px; padding:8px 0; border-bottom:1px solid #222;">
                    <img src="${item.image || 'https://via.placeholder.com/50'}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;">
                    <div style="flex:1;">
                        <h4 style="font-size:14px; color:#fff;">${item.name}</h4>
                        <p style="color:#888; font-size:13px;">Qty: ${item.quantity || 1}</p>
                    </div>
                    <div style="color:#d4af37; font-weight:600;">Rs. ${formatPrice(item.price)}</div>
                </div>
            `;
        });
    }

    // Build full HTML
    details.innerHTML = `
        <div style="margin-bottom:20px; text-align:center;">
            <h3 style="color:#d4af37;">Order #${order.id}</h3>
            <p style="color:#888; font-size:14px;">Placed on ${order.date || new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <div class="status-bar" style="display:flex; justify-content:space-between; align-items:center; margin:20px 0; position:relative;">
            <div style="position:absolute; top:20px; left:0; right:0; height:3px; background:#333; z-index:1;">
                <div style="height:100%; background:linear-gradient(90deg, #d4af37, #28a745); width:${progress}%; transition:width 0.8s ease;"></div>
            </div>
            ${stepsHTML}
        </div>

        <div style="text-align:center; margin:15px 0;">
            <span style="display:inline-block; padding:6px 20px; border-radius:20px; background:${status === 'delivered' ? '#28a745' : status === 'cancelled' ? '#dc3545' : '#ffc107'}; color:${status === 'processing' ? '#000' : '#fff'}; font-weight:600; font-size:14px;">
                <i class="${getStatusIcon(status)}" style="margin-right:8px;"></i>
                ${getStatusLabel(status)}
            </span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; margin:20px 0; padding:15px 0; border-top:1px solid #333; border-bottom:1px solid #333;">
            <div>
                <label style="color:#888; font-size:12px; text-transform:uppercase;">Customer Name</label>
                <p style="color:#fff; font-weight:600; margin-top:4px;">${order.billing?.name || order.billing?.fullName || 'N/A'}</p>
            </div>
            <div>
                <label style="color:#888; font-size:12px; text-transform:uppercase;">Email</label>
                <p style="color:#fff; font-weight:600; margin-top:4px;">${order.billing?.email || 'N/A'}</p>
            </div>
            <div>
                <label style="color:#888; font-size:12px; text-transform:uppercase;">Phone</label>
                <p style="color:#fff; font-weight:600; margin-top:4px;">${order.billing?.phone || 'N/A'}</p>
            </div>
            <div>
                <label style="color:#888; font-size:12px; text-transform:uppercase;">Payment Method</label>
                <p style="color:#fff; font-weight:600; margin-top:4px;">${order.paymentMethod || 'Cash on Delivery'}</p>
            </div>
            <div style="grid-column:1/-1;">
                <label style="color:#888; font-size:12px; text-transform:uppercase;">Shipping Address</label>
                <p style="color:#fff; font-weight:600; margin-top:4px;">${order.billing?.address || 'N/A'}</p>
            </div>
        </div>

        ${itemsHTML ? `
            <div style="margin:15px 0;">
                <h4 style="color:#d4af37; margin-bottom:10px;">🛒 Order Items</h4>
                ${itemsHTML}
            </div>
        ` : ''}

        <div style="display:flex; justify-content:space-between; align-items:center; padding-top:15px; border-top:1px solid #333; margin-top:10px;">
            <span style="color:#888;">Total</span>
            <span style="font-size:20px; font-weight:700; color:#d4af37;">Rs. ${formatPrice(order.total || 0)}</span>
        </div>
    `;

    details.classList.add('show');

    // Scroll to details
    details.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ====================================
// ENTER KEY SUPPORT
// ====================================
document.getElementById('orderIdInput')?.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        trackOrder();
    }
});

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
    updateCartUI();
});

// ====================================
// MAKE FUNCTIONS GLOBAL
// ====================================
window.trackOrder = trackOrder;
window.removeFromCart = removeFromCart;
window.updateCartUI = updateCartUI;

console.log('✅ Tracking Page Loaded!');