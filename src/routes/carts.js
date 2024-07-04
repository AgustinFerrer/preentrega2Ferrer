const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const io = require('../app');  // Importa el servidor Socket.io

const filePath = path.join(__dirname, '../data/carts.json');

const readData = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Crear un nuevo carrito
router.post('/', (req, res) => {
    const carts = readData();
    const newCart = {
        id: (carts.length + 1).toString(),
        products: []
    };

    carts.push(newCart);
    writeData(carts);
    res.status(201).json(newCart);
});

// Listar los productos de un carrito
router.get('/:cid', (req, res) => {
    const carts = readData();
    const cart = carts.find(c => c.id === req.params.cid);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send('Cart not found');
    }
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    const carts = readData();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) {
        return res.status(404).send('Cart not found');
    }

    const productIndex = cart.products.findIndex(p => p.product === req.params.pid);
    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    writeData(carts);
    res.status(201).json(cart);
});

module.exports = router;
