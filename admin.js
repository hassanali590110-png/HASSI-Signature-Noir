// ====================================
// ADMIN.JS - COMPLETE
// ====================================

console.log('✅ Admin JS Loaded!');

// ====================================
// ONLY ADMIN EMAIL
// ====================================
const ADMIN_EMAIL = "hassanali590110@gmail.com";

// ====================================
// CHECK ADMIN ACCESS
// ====================================
function checkAdminAccess() {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (!user) {
        document.body.innerHTML = `
            <div class="admin-access-denied" style="display:flex; justify-content:center; align-items:center; min-height:100vh; background:#0b0b0b; flex-direction:column; padding:20px; text-align:center;">
                <i class="fa-solid fa-lock" style="font-size:70px; color:#d4af37;"></i>
                <h2 style="color:#d4af37; margin:20px 0 10px;">🔒 Access Denied</h2>
                <p style="color:#888;">Please login to access the admin panel.</p>
                <a href="login.html" style="margin-top:20px; padding:12px 30px; background:#d4af37; color:#000; border-radius:30px; text-decoration:none; font-weight:700;">🔑 Login</a>
            </div>
        `;
        return false;
    }

    if (user.email !== ADMIN_EMAIL) {
        document.body.innerHTML = `
            <div class="admin-access-denied" style="display:flex; justify-content:center; align-items:center; min-height:100vh; background:#0b0b0b; flex-direction:column; padding:20px; text-align:center;">
                <i class="fa-solid fa-ban" style="font-size:70px; color:#ff4444;"></i>
                <h2 style="color:#ff4444; margin:20px 0 10px;">⛔ Unauthorized Access</h2>
                <p style="color:#888;">You (${user.email}) do not have permission.</p>
                <p style="color:#888; font-size:14px;">Only <strong style="color:#d4af37;">hassanali590110@gmail.com</strong> can access admin panel.</p>
                <a href="logout.html" style="margin-top:10px; padding:10px 25px; background:#dc3545; color:#fff; border-radius:30px; text-decoration:none; font-weight:600;">🚪 Logout</a>
                <a href="index.html" style="margin-top:10px; padding:10px 25px; background:#333; color:#fff; border-radius:30px; text-decoration:none; font-weight:600;">🏠 Go Home</a>
            </div>
        `;
        return false;
    }

    console.log('✅ Admin Access Granted to:', user.email);
    return true;
}

// ====================================
// FORMAT PRICE
// ====================================
function formatPrice(price) {
    return Number(price).toLocaleString('en-PK');
}

// ====================================
// LOAD STOCK DATA
// ====================================
function loadStockData() {
    let products = JSON.parse(localStorage.getItem('mainProducts')) || [];
    if (products.length === 0) {
        products = [{
            id: 1,
            name: 'Rassasi Hawas Ice',
            price: 8500,
            category: 'Men',
            image: 'images/hawas-ice.jpg',
            stock: 10
        }];
        localStorage.setItem('mainProducts', JSON.stringify(products));
    }

    const product = products[0];
    const card = document.getElementById('stockCard');
    if (!card) return;

    const stock = product.stock || 0;
    let statusClass = 'in-stock';
    let statusText = '✅ In Stock';
    if (stock <= 0) {
        statusClass = 'out-of-stock';
        statusText = '❌ Out of Stock';
    } else if (stock <= 5) {
        statusClass = 'low-stock';
        statusText = '⚠️ Low Stock (' + stock + ' left)';
    }

    card.innerHTML = `
        <img src="${product.image || 'images/hawas-ice.jpg'}" alt="${product.name}" onerror="this.src='images/hawas-ice.jpg'">
        <div class="info">
            <h3>${product.name}</h3>
            <p class="price">Rs. ${formatPrice(product.price)}</p>
            <p class="category">${product.category || 'N/A'}</p>
            <div style="margin-top:10px;">
                <span class="stock-status ${statusClass}">${statusText}</span>
                <span style="color:#888; font-size:14px; margin-left:15px;">Stock: <strong style="color:#fff;" id="currentStock">${stock}</strong></span>
            </div>
            <div class="stock-control">
                <input type="number" id="stockInput" value="${stock}" min="0">
                <button onclick="updateStock()"><i class="fa-solid fa-floppy-disk"></i> Update</button>
            </div>
        </div>
    `;
}

// ====================================
// UPDATE STOCK
// ====================================
function updateStock() {
    const input = document.getElementById('stockInput');
    const newStock = parseInt(input.value);
    if (isNaN(newStock) || newStock < 0) {
        alert('❌ Please enter a valid quantity (0 or more)');
        return;
    }

    let products = JSON.parse(localStorage.getItem('mainProducts')) || [];
    if (products.length === 0) {
        products = [{
            id: 1,
            name: 'Rassasi Hawas Ice',
            price: 8500,
            category: 'Men',
            image: 'images/hawas-ice.jpg',
            stock: 10
        }];
    }

    products[0].stock = newStock;
    localStorage.setItem('mainProducts', JSON.stringify(products));

    let adminProducts = JSON.parse(localStorage.getItem('adminProducts')) || [];
    if (adminProducts.length === 0) {
        adminProducts = [{
            id: 1,
            name: 'Rassasi Hawas Ice',
            price: 8500,
            category: 'Men',
            image: 'images/hawas-ice.jpg',
            stock: 10
        }];
    }
    adminProducts[0].stock = newStock;
    localStorage.setItem('adminProducts', JSON.stringify(adminProducts));

    alert('✅ Stock updated to ' + newStock);
    loadStockData();
}

// ====================================
// LOAD ORDERS
// ====================================
async function loadAdminDashboard() {
    const container = document.getElementById('adminOrders');
    if (!container) return;

    container.innerHTML = `
        <div style="text-align:center; padding:40px; color:#888;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size:30px; color:#d4af37;"></i>
            <p style="margin-top:15px;">Loading orders...</p>
        </div>
    `;

    try {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        if (orders.length > 0) {
            displayOrders(orders);
            updateStats(orders);
            console.log('📦 Orders loaded from localStorage:', orders.length);
        } else {
            showEmptyState();
        }
    } catch (error) {
        console.error('❌ Error loading orders:', error);
        showEmptyState();
    }
}

function displayOrders(orders) {
    const container = document.getElementById('adminOrders');
    if (!container) return;

    if (orders.length === 0) {
        showEmptyState();
        return;
    }

    container.innerHTML = '';
    orders.slice().reverse().forEach(order => {
        const statusClass = order.status || 'processing';
        const statusLabel = {
            processing: 'Processing ⏳',
            shipped: 'Shipped 🚚',
            delivered: 'Delivered ✅',
            cancelled: 'Cancelled ❌'
        } [statusClass] || statusClass;

        let itemsHTML = '';
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                itemsHTML += `
                    <div class="item">
                        <span class="name">${item.name}</span>
                        <span class="qty">× ${item.quantity || 1}</span>
                        <span class="price">Rs. ${formatPrice(item.price)}</span>
                    </div>
                `;
            });
        }

        container.innerHTML += `
            <div class="order-card">
                <div class="header">
                    <span class="id">📦 Order #${order.id}</span>
                    <span style="color:#888; font-size:13px;">${order.date}</span>
                    <span class="status ${statusClass}">${statusLabel}</span>
                </div>
                <div class="details">
                    <strong>👤 ${order.billing?.name || 'Unknown'}</strong><br>
                    📧 ${order.billing?.email || 'N/A'}<br>
                    📞 ${order.billing?.phone || 'N/A'}<br>
                    📍 ${order.billing?.address || 'N/A'}
                </div>
                <div class="items-list">${itemsHTML}</div>
                <div class="footer">
                    <span class="total">Total: Rs. ${formatPrice(order.total || 0)}</span>
                    <span style="color:#888; font-size:13px;">💳 ${order.paymentMethod || 'Cash on Delivery'}</span>
                </div>
            </div>
        `;
    });
}

function updateStats(orders) {
    const pending = orders.filter(o => o.status === 'processing' || o.status === 'shipped');
    const delivered = orders.filter(o => o.status === 'delivered');
    document.getElementById('pendingOrders').textContent = pending.length;
    document.getElementById('deliveredOrders').textContent = delivered.length;
    document.getElementById('totalOrders').textContent = orders.length;
}

function showEmptyState() {
    const container = document.getElementById('adminOrders');
    container.innerHTML = `
        <div class="no-orders">
            <i class="fa-regular fa-clock"></i>
            <h3>No Orders Yet</h3>
            <p>When customers place orders, they will appear here.</p>
        </div>
    `;
    document.getElementById('pendingOrders').textContent = '0';
    document.getElementById('deliveredOrders').textContent = '0';
    document.getElementById('totalOrders').textContent = '0';
}

// ====================================
// LOAD SUBSCRIBERS
// ====================================
function loadSubscribers() {
    const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
    const container = document.getElementById('subscriberList');
    const count = document.getElementById('subscriberCount');
    if (count) count.textContent = subscribers.length;
    if (!container) return;

    if (subscribers.length === 0) {
        container.innerHTML = '<div class="no-subscribers">No subscribers yet.</div>';
        return;
    }

    container.innerHTML = '';
    subscribers.slice().reverse().forEach(sub => {
        container.innerHTML += `
            <div class="subscriber-item">
                <span class="email">${sub.email}</span>
                <span class="date">${sub.date}</span>
            </div>
        `;
    });
}

// ====================================
// MAKE FUNCTIONS GLOBAL
// ====================================
window.loadAdminDashboard = loadAdminDashboard;
window.loadStockData = loadStockData;
window.updateStock = updateStock;
window.loadSubscribers = loadSubscribers;

// ====================================
// LOADER
// ====================================
window.addEventListener('load', function() {
    if (!checkAdminAccess()) return;
    loadAdminDashboard();
    loadStockData();
    loadSubscribers();
    console.log('✅ Admin Dashboard Loaded!');
});
