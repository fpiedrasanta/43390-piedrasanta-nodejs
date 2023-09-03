import { Router } from 'express';
import ProductManager from '../dao/mongo/managers/productManager.js';

const router = Router();

router.get('/', async (req, res) => {
    const productManager = new ProductManager('.');
    const result = await productManager.getProducts();
        
    const products = result.getInnerObject();

    res.render('home', { products: products });
});

router.get('/realtimeproducts', async (req, res) => {
    const productManager = new ProductManager('.');
    const result = await productManager.getProducts();
        
    const products = result.getInnerObject();

    res.render('realTimeProducts', { products: products });
});

router.get('/product', async (req, res) => {
    res.render('product', {
        "id": 0,
        "title": "",
        "description": "",
        "price": 0,
        "thumbnail": "",
        "code": "",
        "stock": 1,
        "isNew": true
    });
});

router.get('/product/:pid', async (req, res) => {
    const pid = req.params.pid;

    const productManager = new ProductManager('.');
    const result = await productManager.getProductById(pid);
    const product = result.getInnerObject();
    
    product.isNew = false;

    res.render('product', product);
});

export default router;