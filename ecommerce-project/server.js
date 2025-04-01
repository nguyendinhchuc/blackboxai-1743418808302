const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Serve static files from the project root
app.use(express.static(path.join(__dirname)));

// Proxy API requests
app.use('/api', createProxyMiddleware({
    target: 'https://ecommece-af2a0921deff.herokuapp.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/ecommerce'
    }
}));

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
    if (req.url.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(__dirname, req.path));
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
