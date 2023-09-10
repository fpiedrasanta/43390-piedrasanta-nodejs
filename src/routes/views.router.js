import { Router } from 'express';
import ProductManager from '../dao/mongo/managers/productManager.js';
import CartManager from '../dao/mongo/managers/cartManager.js';

const router = Router();

router.get('/', async (req, res) => {
    const limit = req.query.limit; // Obtenemos el valor del parámetro "limit" de la URL
    const page = req.query.page;
    const sort = req.query.sort;
    const query = req.query.query;

    const productManager = new ProductManager('.');
    const result = await productManager.getProducts(page, limit, sort, query);
        
    const products = result.getInnerObject();

    const protocol = req.protocol; // Obtenemos el protocolo automáticamente
    const hostname = req.headers.host; // Obtenemos el hostname automáticamente

    res.render('home', { 
        status: 'success', 
        products: products.docs,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: `${protocol}://${hostname}?page=${(products.prevPage||1)}&limit=${(limit||10)}&sort=${(sort||'asc')}&query=${(query||'')}`,
        nextLink: `${protocol}://${hostname}?page=${(products.nextPage||1)}&limit=${(limit||10)}&sort=${(sort||'asc')}&query=${(query||'')}`
    });
});

router.get('/products/:pid', async (req, res) => {
    const pid = req.params.pid;

    const productManager = new ProductManager('.');
    const result = await productManager.getProductById(pid);
    const product = result.getInnerObject();
    
    res.render('productDetail', { product: product });
});

router.get('/realtimeproducts', async (req, res) => {
    const limit = req.query.limit; // Obtenemos el valor del parámetro "limit" de la URL
    const page = req.query.page;
    const sort = req.query.sort;
    const query = req.query.query;

    const productManager = new ProductManager('.');
    const result = await productManager.getProducts(page, limit, sort, query);
        
    const products = result.getInnerObject();

    const protocol = req.protocol; // Obtenemos el protocolo automáticamente
    const hostname = req.headers.host; // Obtenemos el hostname automáticamente

    res.render('realTimeProducts', { 
        status: 'success', 
        products: products.docs,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: `${protocol}://${hostname}/realTimeProducts?page=${(products.prevPage||1)}&limit=${(limit||10)}&sort=${(sort||'asc')}&query=${(query||'')}`,
        nextLink: `${protocol}://${hostname}/realTimeProducts?page=${(products.nextPage||1)}&limit=${(limit||10)}&sort=${(sort||'asc')}&query=${(query||'')}`
    });
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

router.get('/carts/:cid', async (req, res) => {
    const cid = req.params.cid;

    const cartManager = new CartManager('.');
    const result = await cartManager.getCartById(cid);
    const cart = result.getInnerObject();
    
    res.render('cart', { cart: cart });
});

export default router;