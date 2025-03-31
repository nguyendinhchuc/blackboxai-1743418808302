// Product API endpoints
const API_BASE_URL = 'http://localhost:8080/ecommerce/api/products';

// Load products on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
});

// Function to load products
async function loadProducts() {
    try {
        const response = await fetch(API_BASE_URL);
        const products = await response.json();

        if (response.ok) {
            displayProducts(products);
        } else {
            showToast('Failed to load products', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
        console.error('Load products error:', error);
    }
}

// Function to display products in the grid
function displayProducts(products) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = ''; // Clear existing content

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden';
        productCard.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="font-bold text-lg">${product.name}</h3>
                <p class="text-gray-500">$${product.price}</p>
                <button class="mt-2 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Function to add product to cart
function addToCart(productId) {
    // Logic to add product to cart (localStorage or sessionStorage)
    showToast('Product added to cart!', 'success');
}

// Toast notification function (reused from auth.js)
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg text-white ${
        type === 'error' ? 'bg-red-500' : 
        type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}