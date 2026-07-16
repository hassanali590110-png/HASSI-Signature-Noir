// ====================================
// ADMIN - SINGLE PRODUCT STOCK MANAGEMENT
// ====================================

console.log('✅ Admin JS Loaded!');

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
                <a href="index.html" style="margin-top:20px; padding:12px 30px; background:#333; color:#fff; border-radius:30px; text-decoration:none; font-weight:700;">🏠 Go Home</a>
            </div>
        `;
        return false;
    }
    console.log('✅ Admin Access Granted!');
    return true;
}

// ====================================
// SINGLE PRODUCT - RASSASI HAWAS ICE
// ====================================
const product = {
    id: 1,
    name: 'Rassasi Hawas Ice',
    price: 8500,
    category: 'Men',
    image: 'images/hawas-ice.jpg',
    stock: 10,
    desc: 'Rassasi Hawas Ice is a premium luxury fragrance...'
};

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
        products = [product];
        localStorage.setItem('mainProducts', JSON.stringify(products));
    }

    const currentProduct = products[0] || product;

    const nameEl = document.getElementById('productName');
    const stockEl = document.getElementById('currentStock');
    const inputEl = document.getElementById('stockInput');
    const statusEl = document.getElementById('stockStatus');

    if (nameEl) nameEl.textContent = currentProduct.name;
    if (stockEl) stockEl.textContent = currentProduct.stock || 0;
    if (inputEl) inputEl.value = currentProduct.stock || 0;

    if (statusEl) {
        const stock = currentProduct.stock || 0;
        if (stock <= 0) {
            statusEl.textContent = '❌ Out of Stock';
            statusEl.style.color = '#ff4444';
        } else if (stock <= 5) {
            statusEl.textContent = '⚠️ Low Stock (' + stock + ' left)';
            statusEl.style.color = '#ff8844';
        } else {
            statusEl.textContent = '✅ In Stock';
            statusEl.style.color = '#28a745';
        }
    }
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
        products = [product];
    }

    products[0].stock = newStock;
    localStorage.setItem('mainProducts', JSON.stringify(products));

    let adminProducts = JSON.parse(localStorage.getItem('adminProducts')) || [];
    if (adminProducts.length === 0) {
        adminProducts = [product];
    }
    adminProducts[0].stock = newStock;
    localStorage.setItem('adminProducts', JSON.stringify(adminProducts));

    alert(`✅ Stock updated to ${newStock} for ${products[0].name}`);
    loadStockData();
}

// ====================================
// LOAD ORDERS
// ====================================
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const container = document.getElementById('ordersList');

    if (!container) return;

    const totalEl = document.getElementById('totalOrders');
    if (totalEl) totalEl.textContent = orders.length > 0 ? `(${orders.length})` : '';

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="no-orders" style="text-align:center; padding:30px; color:#888;">
                <i class="fa-regular fa-clock" style="font-size:40px; color:#d4af37;"></i>
                <p style="margin-top:10px;">No orders yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    orders.reverse().forEach(order => {
        let itemsHTML = '';
        order.items.forEach(item => {
            itemsHTML += `
                <div class="item" style="display:flex; justify-content:space-between; padding:4px 0; color:#888; font-size:14px;">
                    <span>${item.name} × ${item.quantity || 1}</span>
                    <span style="color:#d4af37;">Rs. ${formatPrice(item.price)}</span>
                </div>
            `;
        });

        const statusClass = order.status || 'processing';
        const statusLabel = statusClass === 'processing' ? 'Processing ⏳' :
            statusClass === 'delivered' ? 'Delivered ✅' :
                statusClass === 'cancelled' ? 'Cancelled ❌' : 'Processing ⏳';

        container.innerHTML += `
            <div class="order-item" style="background:#0b0b0b; padding:15px; border-radius:12px; margin-bottom:12px; border-left:4px solid #d4af37;">
                <div class="header" style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;">
                    <span style="color:#d4af37; font-weight:700;">Order #${order.id}</span>
                    <span style="color:#888; font-size:13px;">${order.date}</span>
                    <span style="padding:2px 12px; border-radius:20px; font-size:12px; font-weight:600; background:${statusClass === 'delivered' ? '#28a745' : statusClass === 'cancelled' ? '#dc3545' : '#ffc107'}; color:${statusClass === 'processing' ? '#000' : '#fff'};">${statusLabel}</span>
                </div>
                <div class="items" style="margin:10px 0;">${itemsHTML}</div>
                <div class="footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding-top:10px; border-top:1px solid #333;">
                    <span style="font-weight:700; color:#d4af37;">Total: Rs. ${formatPrice(order.total)}</span>
                    <span style="color:#888; font-size:13px;">👤 ${order.billing?.name || 'N/A'}</span>
                </div>
            </div>
        `;
    });
}

// ====================================
// MAKE FUNCTIONS GLOBAL
// ====================================
window.loadStockData = loadStockData;
window.updateStock = updateStock;
window.loadOrders = loadOrders;

// ====================================
// LOADER
// ====================================
window.addEventListener('load', function () {
    if (!checkAdminAccess()) return;
    loadStockData();
    loadOrders();
    console.log('✅ Admin Panel Loaded!');
});