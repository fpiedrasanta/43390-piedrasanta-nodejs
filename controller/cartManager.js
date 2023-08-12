import CartRepository from "../repository/cartRepository.js";
import Result from "../helper/result.js";

export default class CartManager {
    #cartRepository

    constructor(path) {
        this.cartRepository = new CartRepository(path, 'carts.json');
    }

    getCarts = async () => {
        try {
            const carts = await this.cartRepository.getCarts();
            return new Result(true, "success", [], carts);
        } catch (error) {
            return new Result(false, error, [], null);
        }
    }

    addCart = async (cart) => {
        try {
            await this.cartRepository.addCart(cart);

            return new Result(true, "El carrito se agregó con éxito", [], cart);
        } catch (error) {
            return new Result(false, error, [], null);
        }
    }

    getCartById = async (id) => {
        try {
            const cart = await this.cartRepository.getCartById(id);
            if(cart) {
                return new Result(true, "success", [], cart);
            } else {
                return new Result(false, "No se encontró el carrito", [], null);
            }
        } catch (error) {
            return new Result(false, error, [], null);
        }
    }

    updateCart = async (cart) => {
        try {
            const dbCart = await this.cartRepository.getCartById(cart.id);

            if(dbCart == null) {
                return new Result(false, "El carrito no existe en la base de datos", [], null);
            }

            await this.cartRepository.updateCart(cart);

            return new Result(true, "El carrito se actualizó con éxito", [], cart);
        } catch (error) {
            return new Result(false, error, [], null);
        }
    }

    deleteCart = async (cart) => {
        try {
            const dbCart = await this.cartRepository.getCartById(cart.id);

            if(dbCart == null) {
                return new Result(false, "El carrito no existe en la base de datos", []);
            }

            await this.cartRepository.deleteCart(cart.id);

            return new Result(true, "El carrito se eliminó con éxito", []);
        } catch (error) {
            return new Result(false, error, [], null);
        }
    }
}