// Load environment variables
require('dotenv').config();

// Admin API base URL 
const ADMIN_API_BASE = process.env.ADMIN_API_BASE_URL || 'http://localhost:8080/api/admin';

// Verify admin authentication
async function verifyAdmin(token) {
    try {
        const response = await fetch(`${ADMIN_API_BASE}/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            window.location.href = '../signin.html';
        }
    } catch (error) {
        console.error('Admin verification error:', error);
        window.location.href = '../signin.html';
    }
}

// Product Management
async function loadProducts() {
    try {
        const response = await fetch(`${ADMIN_API_BASE}/products`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

async function saveProduct(product) {
    try {
        const response = await fetch(`${ADMIN_API_BASE}/products`, {
            method: product.id ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(product)
        });
        return await response.json();
    } catch (error) {
        console.error('Error saving product:', error);
        return null;
    }
}

async function deleteProduct(productId) {
    try {
        await fetch(`${ADMIN_API_BASE}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}

// Order Management
async function loadOrders(status = null) {
    try {
        const url = status ? `${ADMIN_API_BASE}/orders?status=${status}` : `${ADMIN_API_BASE}/orders`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error loading orders:', error);
        return [];
    }
}

async function updateOrderStatus(orderId, status) {
    try {
        await fetch(`${ADMIN_API_BASE}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ status })
        });
        return true;
    } catch (error) {
        console.error('Error updating order status:', error);
        return false;
    }
}

// User Management
async function loadUsers() {
    try {
        const response = await fetch(`${ADMIN_API_BASE}/users`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error loading users:', error);
        return [];
    }
}

async function updateUser(user) {
    try {
        const response = await fetch(`${ADMIN_API_BASE}/users/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(user)
        });
        return await response.json();
    } catch (error) {
        console.error('Error updating user:', error);
        return null;
    }
}

// Settings Management
async function loadSettings() {
    try {
        const response = await fetch(`${ADMIN_API_BASE}/settings`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error loading settings:', error);
        return null;
    }
}

async function saveSettings(settings) {
    try {
        await fetch(`${ADMIN_API_BASE}/settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(settings)
        });
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (!authToken) {
        window.location.href = '../signin.html';
        return;
    }

    // Verify admin privileges
    verifyAdmin(authToken);
});

// Utility functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-md text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Make functions available globally
window.admin = {
    loadProducts,
    saveProduct,
    deleteProduct,
    loadOrders,
    updateOrderStatus,
    loadUsers,
    updateUser,
    loadSettings,
    saveSettings,
    showToast
};