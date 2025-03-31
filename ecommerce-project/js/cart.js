// Cart functionality
const cart = {
    items: [],

    // Initialize cart from localStorage
    init() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
        this.updateCartCount();
    },

    // Add item to cart
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.imageUrl || 'https://via.placeholder.com/50',
                quantity: quantity
            });
        }
        
        this.save();
        this.updateCartCount();
    },

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateCartCount();
    },

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.save();
        }
    },

    // Clear cart
    clear() {
        this.items = [];
        this.save();
        this.updateCartCount();
    },

    // Save cart to localStorage
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    },

    // Calculate cart totals
    calculateTotal() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;
        
        return {
            subtotal: subtotal.toFixed(2),
            shipping: shipping.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2)
        };
    },

    // Update cart count in UI
    updateCartCount() {
        const countElements = document.querySelectorAll('.cart-count');
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        
        countElements.forEach(el => {
            el.textContent = count;
            el.style.display = count > 0 ? 'inline-block' : 'none';
        });
    },

    // Render cart items
    renderCartItems(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">Your cart is empty</p>
                    <a href="products.html" class="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
                        Continue Shopping
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="flex items-center border-b py-4">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
                <div class="flex-1">
                    <h3 class="font-medium">${item.name}</h3>
                    <p class="text-gray-500">$${item.price.toFixed(2)}</p>
                </div>
                <div class="flex items-center">
                    <button class="quantity-btn px-2 py-1 border rounded-l-md" 
                        onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="px-4 py-1 border-t border-b">${item.quantity}</span>
                    <button class="quantity-btn px-2 py-1 border rounded-r-md" 
                        onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <p class="ml-6 font-medium">$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="ml-6 text-red-500 hover:text-red-700" 
                    onclick="cart.removeItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
};

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    cart.init();
    
    // Render cart if on cart page
    if (document.getElementById('cartItems')) {
        cart.renderCartItems('cartItems');
        
        // Update totals
        const totals = cart.calculateTotal();
        document.getElementById('subtotal').textContent = `$${totals.subtotal}`;
        document.getElementById('shipping').textContent = `$${totals.shipping}`;
        document.getElementById('tax').textContent = `$${totals.tax}`;
        document.getElementById('total').textContent = `$${totals.total}`;
    }
});

// Make cart available globally
window.cart = cart;