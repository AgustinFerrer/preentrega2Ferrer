const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const io = require('../app');  // Importa el servidor Socket.io

const filePath = path.join(__dirname, '../data/products.json');

const readData = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const updateClients = () => {
    const products = readData();
    io.emit('updateProducts', products);
};

// Obtener todos los productos (con limitación ?limit)
router.get('/', (req, res) => {
    const products = readData();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
});

// Obtener un producto por ID
router.get('/:pid', (req, res) => {
    const products = readData();
    const product = products.find(p => p.id === req.params.pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
    const products = readData();
    const newProduct = {
        id: (products.length + 1).toString(),
        title: req.body.title,
        description: req.body.description,
        code: req.body.code,
        price: req.body.price,
        status: req.body.status !== undefined ? req.body.status : true,
        stock: req.body.stock,
        category: req.body.category,
        thumbnails: req.body.thumbnails || []
    };

    if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
        return res.status(400).send('All fields are required except thumbnails');
    }

    products.push(newProduct);
    writeData(products);
    updateClients();
    res.status(201).json(newProduct);
});

// Actualizar un producto
router.put('/:pid', (req, res) => {
    const products = readData();
    const productIndex = products.findIndex(p => p.id === req.params.pid);
    if (productIndex !== -1) {
        const product = products[productIndex];
        Object.assign(product, req.body);
        writeData(products);
        updateClients();
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

// Eliminar un producto
router.delete('/:pid', (req, res) => {
    let products = readData();
    products = products.filter(p => p.id !== req.params.pid);
    writeData(products);
    updateClients();
    res.status(204).send();
});

module.exports = router;
