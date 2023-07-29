import Product from "./models/product.js";
import ProductManager from "./controller/productManager.js";
import express from "express";

const app = express();

const port = 8080;

const server = app.listen(port, () => {
    console.log(`Servidor http escuchando en puerto ${server.address().port}`);
})

server.on("error", error => console.log(`Error en servidor: ${error}`));

app.get('/products', async (request, response) => {
    const limit = request.query.limit; // Obtenemos el valor del parámetro "limit" de la URL
    
    const productManager = new ProductManager('.');

    const products = await productManager.getProducts();
    
    if (limit) {
        const cantidad = parseInt(limit, 10); // Parseamos el límite a un número entero
        response.json(products.slice(0, cantidad));
    } else {
        response.json(products);
    }
});

app.get('/products/:pid', async (request, response) => {
    const pid = parseInt(request.params.pid, 10);

    const productManager = new ProductManager('.');
    const product = await productManager.getProductById(pid);

    if (product) {
        response.json(product);
    } else {
        response.status(404).json({ message: 'Producto no encontrado' });
    }
});