const express = require('express');
const router = express.Router();
const fs = require('fs');
const productFilePath = './data/products.json';

const readProducts = () => {
    const data = fs.readFileSync(productFilePath);
    return JSON.parse(data);
};

router.get('/home', (req, res) => {
    const products = readProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
    const products = readProducts();
    res.render('realTimeProducts', { products });
});

module.exports = router;
