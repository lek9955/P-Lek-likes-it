/* ============================================
   NVIDIA Store - Products JavaScript
   ============================================ */

// Products Data
const PRODUCTS = [
    {
        id: 1,
        name: "GeForce RTX 4090",
        category: "Graphics Card",
        price: 59990,
        image: "images/products/rtx4090.png",
        badge: "FLAGSHIP",
        description: "กราฟิกการ์ดรุ่นท็อปสุด ประสิทธิภาพสูงสุด"
    },
    {
        id: 2,
        name: "GeForce RTX 4080 SUPER",
        category: "Graphics Card",
        price: 42990,
        image: "images/products/rtx4080.png",
        badge: "NEW",
        description: "กราฟิกการ์ดระดับสูง สำหรับเกมเมอร์จริงจัง"
    },
    {
        id: 3,
        name: "GeForce RTX 4070 Ti SUPER",
        category: "Graphics Card",
        price: 29990,
        image: "images/products/rtx4070ti.png",
        badge: null,
        description: "ประสิทธิภาพคุ้มค่า สำหรับเกม 1440p"
    },
    {
        id: 4,
        name: "GeForce RTX 4060 Ti",
        category: "Graphics Card",
        price: 15490,
        image: "images/products/rtx4060ti.png",
        badge: "BEST VALUE",
        description: "เริ่มต้นเล่นเกมด้วยเทคโนโลยี RTX"
    },
    {
        id: 5,
        name: "NVIDIA Shield TV Pro",
        category: "Streaming",
        price: 8990,
        image: "images/products/shield.png",
        badge: null,
        description: "สตรีมมิ่งและเกมมิ่ง 4K HDR"
    },
    {
        id: 6,
        name: "NVIDIA Jetson Orin Nano",
        category: "AI & Robotics",
        price: 7490,
        image: "images/products/jetson.png",
        badge: "AI",
        description: "พลัง AI สำหรับ Edge Computing"
    },
    {
        id: 7,
        name: "Gaming Monitor 27\" 4K 144Hz",
        category: "Monitor",
        price: 18990,
        image: "images/products/monitor.png",
        badge: "G-SYNC",
        description: "จอเกมมิ่ง 4K พร้อม G-SYNC"
    },
    {
        id: 8,
        name: "Mechanical Gaming Keyboard RGB",
        category: "Peripherals",
        price: 3490,
        image: "images/products/keyboard.png",
        badge: null,
        description: "คีย์บอร์ดเกมมิ่ง RGB สวิตช์กลไก"
    },
    {
        id: 9,
        name: "Gaming Mouse Wireless",
        category: "Peripherals",
        price: 2990,
        image: "images/products/mouse.png",
        badge: null,
        description: "เมาส์เกมมิ่งไร้สาย น้ำหนักเบา"
    },
    {
        id: 10,
        name: "Pro Gaming Headset 7.1",
        category: "Peripherals",
        price: 4990,
        image: "images/products/headset.png",
        badge: "7.1 SURROUND",
        description: "หูฟังเกมมิ่ง 7.1 Surround Sound"
    }
];

// Render Products Grid
function renderProducts(products = PRODUCTS, containerId = 'productsGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="product-card">
            ${product.badge ? `<span class="badge badge-red">${product.badge}</span>` : ''}
            <img src="${product.image}" alt="${product.name}" class="product-card-image" 
                 onerror="this.src='https://via.placeholder.com/300x300/1a1a1a/76B900?text=${encodeURIComponent(product.name)}'">
            <div class="product-card-body">
                <span class="product-card-category">${product.category}</span>
                <h3 class="product-card-title">${product.name}</h3>
                <div class="product-card-footer">
                    <span class="product-card-price">฿${formatPrice(product.price)}</span>
                    <button class="product-card-btn" onclick="addToCart(${product.id})" title="เพิ่มลงตะกร้า">
                        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Search Products
function searchProducts(query) {
    const searchQuery = query.toLowerCase().trim();

    if (!searchQuery) {
        return PRODUCTS;
    }

    return PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery)
    );
}

// Filter by Category
function filterByCategory(category) {
    if (!category || category === 'all') {
        return PRODUCTS;
    }
    return PRODUCTS.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
    );
}

// Get Categories
function getCategories() {
    return [...new Set(PRODUCTS.map(p => p.category))];
}

// Initialize Products Page
document.addEventListener('DOMContentLoaded', function () {
    // Products page
    if (document.getElementById('productsGrid')) {
        renderProducts();
    }

    // Featured products on home page
    if (document.getElementById('featuredProducts')) {
        renderProducts(PRODUCTS.slice(0, 4), 'featuredProducts');
    }

    // Search page
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const results = searchProducts(e.target.value);
            renderProducts(results, 'searchResults');

            const resultsCount = document.getElementById('resultsCount');
            if (resultsCount) {
                resultsCount.textContent = `พบ ${results.length} รายการ`;
            }
        });
    }

    // Category filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;
            const filtered = filterByCategory(category);
            renderProducts(filtered, 'searchResults');
        });
    });
});
