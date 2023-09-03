import ProductManager from "../dao/mongo/managers/productManager.js";
import { Router } from "express";
import Result from "../helper/result.js";

const router = Router();

router.get('/', async (request, response) => {
    try{
        const limit = request.query.limit; // Obtenemos el valor del parámetro "limit" de la URL
        
        const productManager = new ProductManager('.');
        const result = await productManager.getProducts();
        
        if(!result.isSuccess()) {
            response.status(500).json(result);
            return;
        }

        const products = result.getInnerObject();

        if (limit) {
            const cantidad = parseInt(limit, 10); // Parseamos el límite a un número entero
            
            if(isNaN(cantidad)) {
                response.status(400).json(new Result(false, "El parámetro no es un número", [], null));
            } else if(cantidad < 0) {
                response.status(400).json(new Result(false, "El número debe ser un valor numérico mayor a 0", [], null));
            } else {
                response.status(200).json({ status: 'success', response: products.slice(0, cantidad) });
            }
        } else {
            response.status(200).json({ status: 'success', response: products });
        }
    } catch(error) {
        response.status(500).json(new Result(false, error, [], null));
    }
});

router.get('/:pid', async (request, response) => {
    try {
        const pid = request.params.pid;

        const productManager = new ProductManager('.');
        const result = await productManager.getProductById(pid);

        if(!result.isSuccess()) {
            response.status(500).json(result);
            return;
        }

        const product = result.getInnerObject();

        if (product) {
            response.status(200).json({ status: 'success', response: product });
        } else {
            response.status(404).json(new Result(false, "Producto no encontrado", [], null));
        }
    } catch (error) {
        response.status(500).json(new Result(false, error, [], null));
    }
});

router.post('/', async (request, response) => {
    try{
        const product = request.body; // Obtengo el producto del body
        
        const productManager = new ProductManager('.');

        const result = await productManager.addProduct(product);

        if(!result.isSuccess()) {
            response.status(500).json(result);
            return;
        }

        response.status(200).json({ status: 'success', response: result.getInnerObject() });
    } catch (error) {
        response.status(500).json(new Result(false, error, [], null));
    }
});

router.put('/', async (request, response) => {
    try{
        const product = request.body; // Obtengo el producto del body
        
        const productManager = new ProductManager('.');

        const result = await productManager.updateProduct(product);

        if(!result.isSuccess()) {
            response.status(500).json(result);
            return;
        }

        response.status(200).json({ status: 'success', response: result.getInnerObject() });
    } catch (error) {
        response.status(500).json(new Result(false, error, [], null));
    }
});

router.delete('/:pid', async (request, response) => {
    try {
        const pid = request.params.pid;

        const productManager = new ProductManager('.');
        let result = await productManager.getProductById(pid);

        if(!result.isSuccess()) {
            response.status(500).json(result);
            return;
        }

        const product = result.getInnerObject();

        result = await productManager.deleteProduct(product);

        if(!result.isSuccess()) {
            response.status(500).json(result);
            return;
        }

        response.status(200).json({ status: 'success', response: "El producto se eliminó con éxito." });
    } catch (error) {
        response.status(500).json(new Result(false, error, [], null));
    }
});

export default router;