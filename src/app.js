/*
http://localhost:8080/api/users/auth/githubcallback
43390auth

Owned by: @fpiedrasanta
App ID: 394612
Client ID: Iv1.9246d70038474ffa
Client secrets: a3dc6292c141d43cdeb1417f48115f8c8520cc81
*/

import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import passport from "passport";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/users.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./dao/mongo/managers/productManager.js";
import initializeStrategies from "./config/passport.config.js";

import mongoose from 'mongoose';

import __dirname from './utils.js';

const app = express();

const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://fede:fede@cluster0.pttzmsk.mongodb.net/ecommerce?retryWrites=true&w=majority",
        ttl: (20 * 60)
    }),
    secret: "fede",
    resave: false,
    saveUninitialized: false
}));

initializeStrategies();
app.use(passport.initialize());

app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/", viewsRouter);

const connection = mongoose.connect("mongodb+srv://fede:fede@cluster0.pttzmsk.mongodb.net/ecommerce?retryWrites=true&w=majority");

const server = app.listen(port, () => {
    console.log(`Servidor http escuchando en puerto ${server.address().port}`);
});

server.on("error", error => console.log(`Error en servidor: ${error}`));

const io = new Server(server);

io.on ('connection', socket =>{
    socket.on('delete_product', async data => {
        const pid = data._id;

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