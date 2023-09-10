import ProductManager from "../dao/mongo/managers/productManager.js";
import { Router } from "express";
import Result from "../helper/result.js";

const router = Router();

router.get('/', async (request, response) => {
    try {
        const limit = request.query.limit; // Obtenemos el valor del parámetro "limit" de la URL
        const page = request.query.page;
        const sort = request.query.sort;
        const query = request.query.query;

        const productManager = new ProductManager('.');
        const result = await productManager.getProducts(page, limit, sort, query);
        
        if(!result.isSuccess()) {
            response.status(500).json(result);
            return;
        }

        const products = result.getInnerObject();

        const protocol = request.protocol; // Obtenemos el protocolo automáticamente
        const hostname = request.headers.host; // Obtenemos el hostname automáticamente
        
        response.status(200).json({ 
            status: 'success', 
            response: products.docs,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: `${protocol}://${hostname}/api/products?page=${(products.prevPage||1)}&limit=${(limit||10)}&sort=${(sort||'asc')}&query=${(query||'')}`,
            nextLink: `${protocol}://${hostname}/api/products?page=${(products.nextPage||1)}&limit=${(limit||10)}&sort=${(sort||'asc')}&query=${(query||'')}`
        });
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