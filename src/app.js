import express from "express";
import { Server } from 'socket.io';

import handlebars from 'express-handlebars';

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

import ProductManager from "./controller/productManager.js";

import __dirname from './utils.js';

const app = express();

const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const server = app.listen(port, () => {
    console.log(`Servidor http escuchando en puerto ${server.address().port}`);
});

server.on("error", error => console.log(`Error en servidor: ${error}`));

const io = new Server(server);

io.on ('connection', socket =>{
    socket.on('delete_product', async data => {
        const pid = data.id;

        const productManager = new ProductManager('.');
        let result = await productManager.getProductById(pid);

        const product = result.getInnerObject();

        result = await productManager.deleteProduct(product);

        io.emit('delete_product', data);
    });

    socket.on('new_product', async data => {
        const product = data;
        
        const productManager = new ProductManager('.');

        const result = await productManager.addProduct(product);

        socket.emit('new_product_success', result.getInnerObject());
        io.emit('new_product', result.getInnerObject());
    });

    socket.on('edit_product', async data => {
        const product = data;
        
        const productManager = new ProductManager('.');

        const result = await productManager.updateProduct(product);

        socket.emit('edit_product_success', result.getInnerObject());
        io.emit('edit_product', result.getInnerObject());
    });
});