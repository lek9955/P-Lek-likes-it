/* ============================================
   NVIDIA Store - Checkout JavaScript
   ============================================ */

// Payment Methods Configuration
const PAYMENT_METHODS = {
    qr: {
        name: 'QR Code PromptPay',
        icon: '📱',
        description: 'สแกนจ่ายผ่าน QR Code'
    },
    bank: {
        name: 'โอนผ่านธนาคาร',
        icon: '🏦',
        description: 'โอนเงินผ่านบัญชีธนาคาร'
    },
    cod: {
        name: 'เก็บเงินปลายทาง',
        icon: '📦',
        description: 'ชำระเงินเมื่อรับสินค้า'
    },
    truemoney: {
        name: 'TrueMoney Wallet',
        icon: '💳',
        description: 'ชำระผ่าน TrueMoney'
    }
};

let selectedPayment = null;

// Initialize Checkout
document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('checkoutForm')) return;

    renderCheckoutSummary();
    setupPaymentMethods();
    setupFormValidation();
});

// Render Order Summary
function renderCheckoutSummary() {
    const container = document.getElementById('orderItems');
    const cart = getCart();

    if (!container) return;

    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="order-item flex items-center gap-4 py-3" style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: contain; background: var(--color-black-lighter); border-radius: var(--radius-md); padding: 8px;"
                 onerror="this.src='https://via.placeholder.com/60x60/1a1a1a/76B900?text=GPU'">
            <div class="flex-1">
                <p class="font-medium text-sm">${item.name}</p>
                <p class="text-gray text-sm">x${item.quantity}</p>
            </div>
            <span class="font-semibold">฿${formatPrice(item.price * item.quantity)}</span>
        </div>
    `).join('');

    // Update totals
    const subtotal = getCartTotal();
    const shipping = subtotal >= 5000 ? 0 : 150;
    const total = subtotal + shipping;

    document.getElementById('checkoutSubtotal').textContent = `฿${formatPrice(subtotal)}`;
    document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'ฟรี' : `฿${formatPrice(shipping)}`;
    document.getElementById('checkoutTotal').textContent = `฿${formatPrice(total)}`;
}

// Setup Payment Methods
function setupPaymentMethods() {
    const paymentOptions = document.querySelectorAll('.payment-option');

    paymentOptions.forEach(option => {
        option.addEventListener('click', function () {
            const method = this.dataset.method;
            selectPayment(method);
        });
    });
}

// Select Payment Method
function selectPayment(method) {
    selectedPayment = method;

    // Update UI
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.classList.remove('active');
        const radio = opt.querySelector('input[type="radio"]');
        if (radio) radio.checked = false;
    });

    const selectedOption = document.querySelector(`[data-method="${method}"]`);
    if (selectedOption) {
        selectedOption.classList.add('active');
        const radio = selectedOption.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
    }

    // Show payment details
    document.querySelectorAll('.payment-details').forEach(d => d.classList.remove('active'));
    const details = document.getElementById(`${method}-details`);
    if (details) details.classList.add('active');
}

// Form Validation
function setupFormValidation() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateForm()) return;

        if (!selectedPayment) {
            showToast('กรุณาเลือกวิธีการชำระเงิน', 'error');
            return;
        }

        processOrder();
    });
}

// Validate Form
function validateForm() {
    const required = ['fullname', 'phone', 'address', 'district', 'province', 'zipcode'];
    let isValid = true;

    required.forEach(field => {
        const input = document.getElementById(field);
        if (!input || !input.value.trim()) {
            input.style.borderColor = 'var(--color-error)';
            isValid = false;
        } else {
            input.style.borderColor = 'transparent';
        }
    });

    if (!isValid) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
    }

    return isValid;
}

// Process Order
function processOrder() {
    const orderData = {
        customer: {
            name: document.getElementById('fullname').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            district: document.getElementById('district').value,
            province: document.getElementById('province').value,
            zipcode: document.getElementById('zipcode').value
        },
        items: getCart(),
        total: getCartTotal(),
        payment: selectedPayment,
        orderNumber: generateOrderNumber(),
        date: new Date().toISOString()
    };

    // Show success modal
    showOrderConfirmation(orderData);

    // Clear cart
    clearCart();
}

// Generate Order Number
function generateOrderNumber() {
    return 'NV' + Date.now().toString().slice(-8);
}

// Show Order Confirmation
function showOrderConfirmation(order) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-body text-center" style="padding: var(--space-10);">
                <div style="font-size: 4rem; margin-bottom: var(--space-6);">✅</div>
                <h2 style="color: var(--color-nvidia-green); margin-bottom: var(--space-4);">สั่งซื้อสำเร็จ!</h2>
                <p class="text-gray mb-4">หมายเลขคำสั่งซื้อ</p>
                <p style="font-size: var(--font-size-2xl); font-weight: bold; color: var(--color-white); margin-bottom: var(--space-6);">${order.orderNumber}</p>
                <p class="text-gray mb-8">ขอบคุณที่สั่งซื้อ! เราจะจัดส่งสินค้าโดยเร็วที่สุด</p>
                <a href="index.html" class="btn btn-primary btn-lg">กลับหน้าแรก</a>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}
