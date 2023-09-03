import CartManager from "../dao/mongo/managers/cartManager.js";
import { Router } from "express";
import Result from "../helper/result.js";
import ProductManager from "../dao/mongo/managers/productManager.js";

const router = Router();

router.post('/', async (request, response) => {
    try {
        const cart = request.body;
        
        const cartManager = new CartManager('.');

        const result = await cartManager.addCart(cart);

        if(!result.isSuccess()) {
            response.status(500).json(result);
            return;
        }

        response.status(200).json({ status: 'success', response: result.getInnerObject() });
    } catch (error) {
        response.status(500).json(new Result(false, error, [], null));
    }
});

router.get('/:cid', async (request, response) => {
    try {
        
        const cid = request.params.cid;

        const cartManager = new CartManager('.');
        const result = await cartManager.getCartById(cid);

        if(!result.isSuccess()) {
            response.status(500).json(result);
            return;
        }

        const cart = result.getInnerObject();

        if (cart) {
            response.status(200).json({ status: 'success', response: cart });
        } else {
            response.status(404).json(new Result(false, "Carrito no encontrado", [], null));
        }

    } catch (error) {
        response.status(500).json(new Result(false, error, [], null));
    }
});

router.post('/:cid/product/:pid', async (request, response) => {
    try {
        const cid = request.params.cid;
        const pid = request.params.pid;
        
        const cartManager = new CartManager('.');
        const productManager = new ProductManager('.');

        const cartResult = await cartManager.getCartById(cid);

        if(!cartResult.isSuccess()) {
            response.status(500).json(cartResult);
            return;
        }

        const productResult = await productManager.getProductById(pid);

        if(!productResult.isSuccess()) {
            response.status(500).json(productResult);
            return;
        }

        const cart = cartResult.getInnerObject();
        const product = productResult.getInnerObject();
        
        cart.products.push({
            product: pid,
            quantity: 1
        });
        
        const updateResult = await cartManager.updateCart(cart);
        
        if(!updateResult.isSuccess()) {
            response.status(500).json(updateResult);
            return;
        }

        response.status(200).json({ status: 'success', response: updateResult.getInnerObject() });
    } catch (error) {
        response.status(500).json(new Result(false, error, [], null));
    }
});

export default router;