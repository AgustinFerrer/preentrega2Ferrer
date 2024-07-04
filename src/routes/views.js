const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../data/products.json');

const readData = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Vista home
router.get('/home', (req, res) => {
    const products = readData();
    res.render('home', { products });
});

// Vista real-time-products
router.get('/realtimeproducts', (req, res) => {
    const products = readData();
    res.render('realTimeProducts', { products });
});

module.exports = router;
