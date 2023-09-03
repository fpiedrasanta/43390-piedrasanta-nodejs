import cartModel from "../models/cart.js";

export default class CartRepository {
    constructor() { }

    getCarts = async () => {
        try {
            return await cartModel.find();
        } catch(error) {
            throw new Error(
                `Se generó un error en la lectura de los carritos: ${error}`
            );
        }
    }

    addCart = async (cart) => {
        try {
            return await cartModel.create(cart);
        } catch (error) {
            
            throw new Error(
                `Se generó un error en la escritura del carrito: ${error}`
            );

        }
    }

    updateCart = async (cart) => {
        try {
            return cartModel.updateOne({_id: cart._id}, {$set:cart});
        } catch (error) {

            throw new Error(
                `Se generó un error en la actualización del carrito: ${error}`
            );

        }
    }
    
    getCartById = async (id) => {
        try {
            return await cartModel.findById(id);          
        } catch (error) {

            throw new Error(
                `Se generó un error mientras obteniamos el carrito: ${error}`
            );

        }
    }

    deleteCart = async (id) => {
        try {
            return await cartModel.deleteOne({_id: id});
        } catch (error) {

            throw new Error(
                `Se generó un error mientras eliminabamos el carrito: ${error}`
            );

        }
    }
}