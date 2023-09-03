import File from "../../../helper/result.js";
import Cart from "../models/cart.js";

export default class CartRepository {
    #file
    constructor(path, fileName) {
        this.file = new File(path, fileName, 'utf-8');
    }

    getCarts = async () => {
        try {
            if(!this.file.exist()) return [];
            
            const data = await this.file.read();
            const carts = JSON.parse(data);
            
            const array = [];
            for (const cart of carts) {
                array.push(Cart.fromObject(cart));
            }
            
            return array;
        } catch(error) {
            throw new Error(
                `Se generó un error en la lectura de los carritos: ${error}`
            );
        }
    }

    addCart = async (cart) => {
        try {

            let maxId = 0;
            const carts = await this.getCarts();

            if(carts && carts.length > 0) {
                maxId = carts.reduce((prev, current) => {
                    return (prev.id > current.id) ? prev : current;
                }).id;
            }

            cart.id = maxId + 1;

            carts.push(cart);

            await this.file.write(JSON.stringify(carts, null, '\t'));

        } catch (error) {
            
            throw new Error(
                `Se generó un error en la escritura del carrito: ${error}`
            );

        }
    }

    updateCart = async (cart) => {
        try {

            const carts = await this.getCarts();
            const newCarts = carts.filter(p => p.id !== parseInt(cart.id));

            newCarts.push(cart);

            await this.file.write(JSON.stringify(newCarts, null, '\t'));

        } catch (error) {

            throw new Error(
                `Se generó un error en la actualización del carrito: ${error}`
            );

        }
    }
    
    getCartById = async (id) => {
        try {

            const carts = await this.getCarts();
            const cart = carts.find(p => p.id == parseInt(id));

            if(cart)
                return Cart.fromObject(cart);
            
            return null;
            
        } catch (error) {

            throw new Error(
                `Se generó un error mientras obteniamos el carrito: ${error}`
            );

        }
    }

    deleteCart = async (id) => {
        try {

            const carts = await this.getCarts();
            const newCarts = carts.filter(p => p.id != parseInt(id));

            await this.file.write(JSON.stringify(newCarts, null, '\t'));

        } catch (error) {

            throw new Error(
                `Se generó un error mientras eliminabamos el carrito: ${error}`
            );

        }
    }
}