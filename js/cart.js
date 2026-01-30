/* ============================================
   NVIDIA Store - Cart JavaScript
   ============================================ */

// Get Cart from LocalStorage
function getCart() {
    const cart = localStorage.getItem('nvidia_cart');
    return cart ? JSON.parse(cart) : [];
}

// Save Cart to LocalStorage
function saveCart(cart) {
    localStorage.setItem('nvidia_cart', JSON.stringify(cart));
    updateCartCount();
}

// Add to Cart
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);
    showToast(`เพิ่ม ${product.name} ลงตะกร้าแล้ว!`);
}

// Remove from Cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCart();
}

// Update Quantity
function updateQuantity(productId, change) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        saveCart(cart);
        renderCart();
    }
}

// Calculate Total
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Render Cart Items
function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    const summaryContainer = document.getElementById('cartSummary');
    const cart = getCart();

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🛒</div>
                <h3>ตะกร้าว่างเปล่า</h3>
                <p class="text-gray">ยังไม่มีสินค้าในตะกร้า</p>
                <a href="products.html" class="btn btn-primary mt-8">เลือกซื้อสินค้า</a>
            </div>
        `;
        if (summaryContainer) {
            summaryContainer.style.display = 'none';
        }
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">฿${formatPrice(item.price)}</p>
                <div class="cart-item-actions">
                    <div class="qty-selector">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <input type="text" class="qty-value" value="${item.quantity}" readonly>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="btn btn-ghost btn-sm" onclick="removeFromCart(${item.id})" style="color: var(--color-error);">
                        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        ลบ
                    </button>
                </div>
            </div>
            <div class="cart-item-subtotal">
                <span class="text-gray text-sm">รวม</span>
                <span class="text-white font-bold">฿${formatPrice(item.price * item.quantity)}</span>
            </div>
        </div>
    `).join('');

    // Update Summary
    if (summaryContainer) {
        summaryContainer.style.display = 'block';
        const subtotal = getCartTotal();
        const shipping = subtotal >= 5000 ? 0 : 150;
        const total = subtotal + shipping;

        document.getElementById('subtotal').textContent = `฿${formatPrice(subtotal)}`;
        document.getElementById('shipping').textContent = shipping === 0 ? 'ฟรี' : `฿${formatPrice(shipping)}`;
        document.getElementById('total').textContent = `฿${formatPrice(total)}`;
    }
}

// Clear Cart
function clearCart() {
    localStorage.removeItem('nvidia_cart');
    updateCartCount();
    if (typeof renderCart === 'function') renderCart();
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('cartItems')) {
        renderCart();
    }
});
