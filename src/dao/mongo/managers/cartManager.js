import CartRepository from "../repository/cartRepository.js";
import Result from "../../../helper/result.js";

export default class CartManager {
    #cartRepository

    constructor(path) {
        this.cartRepository = new CartRepository();
    }

    getCarts = async () => {
        try {
            const carts = await this.cartRepository.getCarts();
            return new Result(200, true, "success", [], carts);
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }

    addCart = async (cart) => {
        try {
            const newCart = await this.cartRepository.addCart(cart);

            return new Result(
                200, 
                true, 
                "El carrito se agregó con éxito", 
                [], 
                newCart);
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }

    getCartById = async (id) => {
        try {
            const cart = await this.cartRepository.getCartById(id);
            if(cart) {
                return new Result(200, true, "success", [], cart);
            } else {
                return new Result(
                    404, 
                    false, 
                    "No se encontró el carrito", 
                    [], 
                    null);
            }
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }

    updateCart = async (cart) => {
        try {
            const dbCart = await this.cartRepository.getCartById(cart._id);

            if(dbCart == null) {
                return new Result(
                    404,
                    false, 
                    "El carrito no existe en la base de datos", 
                    [], 
                    null);
            }

            await this.cartRepository.updateCart(cart);

            return new Result(
                200, 
                true, 
                "El carrito se actualizó con éxito", 
                [], 
                cart);
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }

    deleteCart = async (cart) => {
        try {
            const dbCart = await this.cartRepository.getCartById(cart._id);

            if(dbCart == null) {
                return new Result(
                    404, 
                    false, 
                    "El carrito no existe en la base de datos", 
                    []);
            }

            await this.cartRepository.deleteCart(cart._id);

            return new Result(
                200, 
                true, 
                "El carrito se eliminó con éxito", 
                []);
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }
}