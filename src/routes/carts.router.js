const express = require('express');
const fs = require('fs');
const router = express.Router();
const filePath = './models/carts.json';


const readData = () => {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

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


router.get('/:cid', (req, res) => {
    const carts = readData();
    const cart = carts.find(c => c.id === req.params.cid);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send('Cart not found');
    }
});


router.post('/:cid/product/:pid', (req, res) => {
    const carts = readData();
    const cart = carts.find(c => c.id === req.params.cid);
    if (cart) {
        const product = cart.products.find(p => p.product === req.params.pid);
        if (product) {
            product.quantity += 1;
        } else {
            cart.products.push({
                product: req.params.pid,
                quantity: 1
            });
        }
        writeData(carts);
        res.status(201).json(cart);
    } else {
        res.status(404).send('Cart not found');
    }
});

module.exports = router;
