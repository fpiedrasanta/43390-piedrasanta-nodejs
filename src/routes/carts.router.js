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
            return response.status(result.getCode()).json(result);
        }

        return response.status(200).json({ 
            status: 'success', 
            response: result.getInnerObject() 
        });
    } catch (error) {
        return response.status(500).json(new Result(
            500,
            false, 
            error.message, 
            [], 
            null));
    }
});

router.get('/:cid', async (request, response) => {
    try {
        const cid = request.params.cid;

        const cartManager = new CartManager('.');
        const result = await cartManager.getCartById(cid);

        if(!result.isSuccess()) {
            return response.status(result.getCode()).json(result);
        }

        const cart = result.getInnerObject();

        if (cart) {
            return response.status(200).json({ 
                status: 'success', 
                response: cart 
            });
        } else {
            return response.status(404).json(new Result(
                404,
                false, 
                "Carrito no encontrado", 
                [], 
                null));
        }

    } catch (error) {
        return response.status(500).json(new Result(
            500,
            false, 
            error.message, 
            [], 
            null));
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
            return response.status(cartResult.getCode()).json(cartResult);
        }

        const productResult = await productManager.getProductById(pid);

        if(!productResult.isSuccess()) {
            return response.status(productResult.getCode()).json(productResult);
        }

        const cart = cartResult.getInnerObject();
        
        if (!cart) {
            return response.status(404).json(new Result(
                404,
                false, 
                "Carrito no encontrado", 
                [], 
                null));
        }

        const product = productResult.getInnerObject();

        if (!product) {
            return response.status(404).json(new Result(
                404,
                false, 
                "Producto no encontrado", 
                [], 
                null));
        }

        cart.products.push({
            product: pid,
            quantity: 1
        });
        
        const updateResult = await cartManager.updateCart(cart);
        
        if(!updateResult.isSuccess()) {
            return response.status(updateResult.getCode()).json(updateResult);
        }

        return response.status(200).json({ 
            status: 'success', 
            response: updateResult.getInnerObject() 
        });
    } catch (error) {
        return response.status(500).json(new Result(
            500,
            false, 
            error.message, 
            [], 
            null));
    }
});

router.delete("/:cid/products/:pid", async (request, response) => {
    try {
        const { cid, pid } = request.params;
  
        // Busca el carrito por su ID
        const cartManager = new CartManager();
        const result = await cartManager.getCartById(cid);
  
        if (!result.isSuccess()) {
            return response.status(result.getCode()).json(result);
        }
  
        const cart = result.getInnerObject();

        // Encuentra el índice del producto que deseas eliminar en el array de productos
        const productIndex = cart.products.findIndex(
            (product) => product.product._id.toString() === pid
        );
  
        if (productIndex === -1) {
            return response.status(404).json(new Result(
                404,
                false,
                "Producto no encontrado",
                [],
                null
            ));
        }
  
        // Elimina el producto del array
        cart.products.splice(productIndex, 1);
    
        const updateResult = await cartManager.updateCart(cart);
        
        if(!updateResult.isSuccess()) {
            return response.status(updateResult.getCode()).json(updateResult);
        }
  
        return response.status(200).json({ 
            status: "success",
            response: "Producto eliminado del carrito con éxito" 
        });
    } catch (error) {
        return response.status(500).json(new Result(
            500,
            false,
            error.message,
            [],
            null
        ));
    }
});

router.put("/:cid", async (request, response) => {
    try {
        const { cid } = request.params;
        const { products } = request.body;
    
        const cartManager = new CartManager();
        const result = await cartManager.getCartById(cid);
  
        if (!result.isSuccess()) {
            return response.status(result.getCode()).json(result);
        }
    
        const cart = result.getInnerObject();
    
        // Actualiza el arreglo de productos en el carrito
        cart.products = products;
    
        // Guarda el carrito actualizado en la base de datos
        const updateResult = await cartManager.updateCart(cart);
        
        if(!updateResult.isSuccess()) {
            return response.status(updateResult.getCode()).json(updateResult);
        }
    
        return response.status(200).json({ 
            status: "success", 
            response: "Productos actualizado con éxito" 
        });
    } catch (error) {
        return response.status(500).json(new Result(
            500,
            false,
            error.message,
            [],
            null
        ));
    }
});

router.put("/:cid/products/:pid", async (request, response) => {
    try {
        const { cid, pid } = request.params;
        const { quantity } = request.body;
    
        const cartManager = new CartManager();
        const result = await cartManager.getCartById(cid);
  
        if (!result.isSuccess()) {
            return response.status(result.getCode()).json(result);
        }
    
        const cart = result.getInnerObject();
  
        // Encuentra el producto en el carrito por su ID
        const productToUpdate = cart.products.find(
            (product) => product.product._id.toString() === pid
        );
  
        if (!productToUpdate) {
            return response.status(404).json(new Result(
                404,
                false,
                "No se encontró el producto",
                [],
                null
            ));
        }
  
        // Actualiza la cantidad del producto
        productToUpdate.quantity = quantity;
  
        // Guarda el carrito actualizado en la base de datos
        const updateResult = await cartManager.updateCart(cart);
        
        if(!updateResult.isSuccess()) {
            return response.status(updateResult.getCode()).json(updateResult);
        }
  
        return response.status(200).json({ 
            status: "success",
            response: "El producto se actualizó con éxito"
        });
    } catch (error) {
        return response.status(500).json(new Result(
            500,
            false,
            error.message,
            [],
            null
        ));
    }
});

router.delete("/:cid", async (request, response) => {
    try {
        const { cid } = request.params;
    
        // Busca el carrito por su ID
        const cartManager = new CartManager();
        const result = await cartManager.getCartById(cid);
  
        if (!result.isSuccess()) {
            return response.status(result.getCode()).json(result);
        }
    
        const cart = result.getInnerObject();
    
        // Elimina todos los productos del carrito
        cart.products = [];
    
        // Guarda el carrito actualizado en la base de datos
        const updateResult = await cartManager.updateCart(cart);
        
        if(!updateResult.isSuccess()) {
            return response.status(updateResult.getCode()).json(updateResult);
        }
    
        return response.status(200).json({ 
            status: "success",
            message: "Todos los productos del carrito han sido eliminados con éxito" 
        });
    } catch (error) {
        return response.status(500).json(new Result(
            500,
            false,
            error.message,
            [],
            null
        ));
    }
});

export default router;