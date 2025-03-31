// Authentication API endpoints
const API_BASE_URL = 'http://localhost:8080/ecommerce/api/auth';

// Sign In Form Handler
document.getElementById('signinForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    try {
        const response = await fetch(`${API_BASE_URL}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token based on remember me choice
            if (rememberMe) {
                localStorage.setItem('authToken', data.token);
            } else {
                sessionStorage.setItem('authToken', data.token);
            }
            
            // Redirect to products page
            window.location.href = 'products.html';
        } else {
            showToast(data.message || 'Sign in failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
        console.error('Sign in error:', error);
    }
});

// Sign Up Form Handler
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    // Password confirmation validation
    if (formData.password !== document.getElementById('confirmPassword').value) {
        showToast('Passwords do not match', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Account created successfully! Please sign in.', 'success');
            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 2000);
        } else {
            showToast(data.message || 'Sign up failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
        console.error('Sign up error:', error);
    }
});

// Toast notification function
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

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (authToken && (window.location.pathname.includes('signin.html') || 
                      window.location.pathname.includes('signup.html'))) {
        window.location.href = 'products.html';
    }
});