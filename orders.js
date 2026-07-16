// ====================================
// ORDERS.JS - COMPLETE
// ====================================

console.log('✅ Orders JS Loaded!');

// ====================================
// FORMAT PRICE
// ====================================
function formatPrice(price) {
    return Number(price).toLocaleString('en-PK');
}

// ====================================
// GENERATE INVOICE - WORKING
// ====================================
function generateInvoice(orderId) {
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        alert('❌ Order not found!');
        return;
    }

    // Calculate totals
    let subtotal = order.subtotal || 0;
    let tax = order.tax || 0;
    let shipping = order.shipping || 0;
    let total = order.total || 0;

    if (!order.subtotal && order.items) {
        subtotal = order.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
        tax = Math.round(subtotal * 0.05);
        shipping = subtotal > 5000 ? 0 : 250;
        total = subtotal + tax + shipping;
    }

    // Build items HTML
    let itemsHTML = '';
    if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity) || 1;
            const itemTotal = price * qty;
            itemsHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td style="text-align:center;">${qty}</td>
                    <td style="text-align:right;">Rs. ${formatPrice(price)}</td>
                    <td style="text-align:right;">Rs. ${formatPrice(itemTotal)}</td>
                </tr>
            `;
        });
    } else {
        itemsHTML = `
            <tr>
                <td colspan="4" style="text-align:center; color:#888;">No items found</td>
            </tr>
        `;
    }

    // Invoice HTML
    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice #${order.id}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Poppins', sans-serif; 
            background: #f5f5f5; 
            padding: 40px; 
            color: #333; 
        }
        .invoice { 
            max-width: 800px; 
            margin: 0 auto; 
            background: #fff; 
            padding: 40px; 
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .header { 
            display: flex; 
            justify-content: space-between; 
            border-bottom: 3px solid #d4af37; 
            padding-bottom: 20px; 
            margin-bottom: 25px; 
            flex-wrap: wrap;
            gap: 15px;
        }
        .logo { 
            color: #d4af37; 
            font-size: 28px; 
            font-weight: 700; 
        }
        .logo span { 
            display: block; 
            font-size: 12px; 
            color: #888; 
            font-weight: 400;
        }
        .invoice-title { 
            color: #d4af37; 
            font-size: 22px; 
            font-weight: 700; 
            text-align: right;
        }
        .invoice-title small {
            display: block;
            font-size: 14px;
            color: #888;
            font-weight: 400;
        }
        .details { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 30px; 
            margin-bottom: 30px; 
        }
        .details .label { 
            color: #888; 
            font-size: 12px; 
            text-transform: uppercase; 
            letter-spacing: 1px;
        }
        .details .value { 
            font-weight: 600; 
            font-size: 15px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
        }
        table th { 
            background: #f8f5f0; 
            padding: 12px 15px; 
            text-align: left; 
            font-size: 13px; 
            text-transform: uppercase; 
            color: #555;
        }
        table td { 
            padding: 12px 15px; 
            border-bottom: 1px solid #eee; 
        }
        .grand-total { 
            text-align: right; 
            font-size: 22px; 
            font-weight: 700; 
            color: #d4af37; 
            border-top: 2px solid #d4af37; 
            padding-top: 15px; 
            margin-top: 15px; 
        }
        .footer { 
            text-align: center; 
            color: #888; 
            font-size: 13px; 
            margin-top: 30px; 
            border-top: 1px solid #eee; 
            padding-top: 20px; 
        }
        .print-btn { 
            display: inline-block; 
            padding: 12px 35px; 
            background: #d4af37; 
            color: #000; 
            border: none; 
            border-radius: 30px; 
            font-weight: 600; 
            cursor: pointer; 
            margin-top: 20px;
            transition: 0.3s;
            font-size: 14px;
        }
        .print-btn:hover {
            transform: scale(1.05);
        }
        .print-btn.close-btn {
            background: #333;
            color: #fff;
            margin-left: 10px;
        }
        @media print { 
            .print-btn { display: none; }
            .invoice { box-shadow: none; border: 1px solid #ddd; }
            body { background: #fff; padding: 20px; }
        }
        @media (max-width: 600px) {
            .details { grid-template-columns: 1fr; gap: 15px; }
            .header { flex-direction: column; }
            .invoice-title { text-align: left; }
            table { font-size: 14px; }
            table th, table td { padding: 8px 10px; }
        }
    </style>
</head>
<body>
    <div class="invoice">
        <div class="header">
            <div>
                <div class="logo">HASSI<span>Signature Noir</span></div>
                <p style="color:#888; font-size:13px; margin-top:5px;">
                    📧 hassanali590110@gmail.com<br>
                    📞 +92 332 3365097
                </p>
            </div>
            <div>
                <div class="invoice-title">
                    INVOICE
                    <small>Order #${order.id}</small>
                </div>
                <p style="color:#888; font-size:13px; margin-top:5px; text-align:right;">
                    Date: ${order.date || new Date().toLocaleDateString()}
                </p>
            </div>
        </div>

        <div class="details">
            <div>
                <p class="label">Bill To</p>
                <p class="value">${order.billing?.name || order.billing?.fullName || 'N/A'}</p>
                <p style="color:#888; font-size:14px;">${order.billing?.email || 'N/A'}</p>
                <p style="color:#888; font-size:14px;">${order.billing?.phone || 'N/A'}</p>
                <p style="color:#888; font-size:14px;">${order.billing?.address || 'N/A'}</p>
            </div>
            <div style="text-align:right;">
                <p><span class="label">Payment Method</span><br><span class="value">${order.paymentMethod || 'Cash on Delivery'}</span></p>
                <p><span class="label">Status</span><br>
                    <span class="value" style="color:${order.status === 'delivered' ? '#28a745' : order.status === 'cancelled' ? '#dc3545' : '#d4af37'}; font-weight:600;">
                        ${order.status || 'Processing'}
                    </span>
                </p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th style="text-align:center;">Qty</th>
                    <th style="text-align:right;">Price</th>
                    <th style="text-align:right;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
                <tr style="font-weight:700; border-top:2px solid #d4af37;">
                    <td colspan="3" style="text-align:right;">Subtotal</td>
                    <td style="text-align:right;">Rs. ${formatPrice(subtotal)}</td>
                </tr>
                <tr>
                    <td colspan="3" style="text-align:right; color:#888;">Tax (5%)</td>
                    <td style="text-align:right; color:#888;">Rs. ${formatPrice(tax)}</td>
                </tr>
                <tr>
                    <td colspan="3" style="text-align:right; color:#888;">Shipping</td>
                    <td style="text-align:right; color:#888;">${shipping === 0 ? 'Free' : 'Rs. ' + formatPrice(shipping)}</td>
                </tr>
            </tbody>
        </table>

        <div class="grand-total">
            <span>Total: Rs. ${formatPrice(total)}</span>
        </div>

        <div style="text-align:center; margin-top:20px;">
            <p style="color:#888; font-size:14px;">Thank you for shopping with HASSI Signature Noir! ✨</p>
            <p style="color:#666; font-size:13px;">💳 EasyPaisa: 0333-2944558 (Marvikamran)</p>
        </div>

        <div style="text-align:center; margin-top:20px;">
            <button class="print-btn" onclick="window.print()">🖨️ Print / PDF</button>
            <button class="print-btn close-btn" onclick="window.close()">✕ Close</button>
        </div>

        <div class="footer">
            <p>© 2026 HASSI Signature Noir. All rights reserved.</p>
            <p style="font-size:11px; margin-top:5px; color:#aaa;">This is a computer-generated invoice. No signature required.</p>
        </div>
    </div>
</body>
</html>
    `;

    // Open new window
    const win = window.open('', '_blank', 'width=900,height=700,scrollbars=yes');
    if (!win) {
        alert('❌ Please allow popups for this website to view invoice.');
        return;
    }
    win.document.write(invoiceHTML);
    win.document.close();
}

// ====================================
// LOAD ORDERS
// ====================================
function loadOrders() {
    const container = document.getElementById('ordersContainer');
    if (!container) return;

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const totalEl = document.getElementById('totalOrders');
    if (totalEl) totalEl.textContent = orders.length;

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders" style="text-align:center; padding:60px 20px;">
                <i class="fa-regular fa-clock" style="font-size:60px; color:#d4af37;"></i>
                <h3 style="color:#fff; margin:20px 0 10px;">No Orders Yet</h3>
                <p style="color:#888;">You haven't placed any orders yet.</p>
                <a href="index.html#products" class="btn-primary" style="display:inline-block; margin-top:20px; padding:14px 35px; background:#d4af37; color:#000; border-radius:30px; text-decoration:none; font-weight:600;">🛍️ Start Shopping</a>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    orders.slice().reverse().forEach(order => {
        const statusClass = order.status || 'processing';
        const statusLabels = {
            delivered: 'Delivered ✓',
            processing: 'Processing ⏳',
            shipped: 'Shipped 🚚',
            cancelled: 'Cancelled ✕'
        };

        let itemsHTML = '';
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                itemsHTML += `
                    <div class="order-item" style="display:flex; align-items:center; gap:15px; padding:8px 0;">
                        <img src="images/hawas-ice.jpg" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; border-radius:10px;" onerror="this.src='images/hawas-ice.jpg'">
                        <div class="item-info" style="flex:1;">
                            <h4 style="font-size:14px; color:#fff;">${item.name}</h4>
                            <p style="color:#888; font-size:13px;">Qty: ${item.quantity || 1} × Rs. ${formatPrice(item.price)}</p>
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML += `
            <div class="order-card" style="background:#1a1a1a; border-radius:16px; padding:25px; margin-bottom:20px; border:1px solid transparent; transition:0.3s;">
                <div class="order-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding-bottom:15px; border-bottom:1px solid #333;">
                    <span class="order-id" style="color:#d4af37; font-weight:700;">📦 Order #${order.id}</span>
                    <span class="order-date" style="color:#888; font-size:14px;">${order.date || new Date().toLocaleDateString()}</span>
                    <span class="order-status ${statusClass}" style="padding:4px 16px; border-radius:20px; font-size:13px; font-weight:600; ${statusClass === 'delivered' ? 'background:#28a745; color:#fff;' : statusClass === 'cancelled' ? 'background:#dc3545; color:#fff;' : 'background:#ffc107; color:#000;'}">${statusLabels[statusClass]}</span>
                </div>
                <div class="order-items" style="padding:15px 0;">${itemsHTML}</div>
                <div class="order-footer" style="display:flex; justify-content:space-between; align-items:center; padding-top:15px; border-top:1px solid #333; flex-wrap:wrap; gap:10px;">
                    <span class="total" style="font-size:18px; font-weight:700; color:#d4af37;">Total: Rs. ${formatPrice(order.total)}</span>
                    <div class="order-actions" style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button class="invoice-btn" onclick="generateInvoice('${order.id}')" style="padding:6px 16px; background:#d4af37; color:#000; border:none; border-radius:20px; cursor:pointer; font-weight:600; transition:0.3s; font-size:13px;">
                            📄 Invoice
                        </button>
                    </div>
                </div>
                <div class="order-billing" style="color:#888; font-size:13px; margin-top:10px; padding-top:10px; border-top:1px solid #222;">
                    <strong style="color:#aaa;">👤 ${order.billing?.name || order.billing?.fullName || 'N/A'}</strong> | 📧 ${order.billing?.email || 'N/A'} | 📞 ${order.billing?.phone || 'N/A'} | 📍 ${order.billing?.address || 'N/A'}
                </div>
            </div>
        `;
    });
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
    loadOrders();
    updateCartUI();
    console.log('✅ Orders Page Loaded!');
});

// ====================================
// MAKE FUNCTIONS GLOBAL
// ====================================
window.generateInvoice = generateInvoice;
window.loadOrders = loadOrders;
window.removeFromCart = removeFromCart;
window.updateCartUI = updateCartUI;