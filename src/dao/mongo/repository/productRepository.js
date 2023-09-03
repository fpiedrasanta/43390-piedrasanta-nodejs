import productModel from "../models/product.js";

export default class ProductRepository {
    constructor() { }

    getProducts = async () => {
        try {
            return await productModel.find().lean();
        } catch(error) {
            throw new Error(
                `Se generó un error en la lectura de los productos: ${error}`
            );
        }
    }

    addProduct = async (product) => {
        try {
            return await productModel.create(product);
        } catch (error) {
            
            throw new Error(
                `Se generó un error en la escritura del producto: ${error}`
            );

        }
    }

    updateProduct = async (product) => {
        try {
            return productModel.updateOne({_id: product._id}, {$set:product});
        } catch (error) {

            throw new Error(
                `Se generó un error en la actualización del producto: ${error}`
            );

        }
    }
    
    getProductById = async (id) => {
        try {
            return await productModel.findById(id).lean();
        } catch (error) {

            throw new Error(
                `Se generó un error mientras obteniamos el producto: ${error}`
            );

        }
    }

    deleteProduct = async (id) => {
        try {
            return await productModel.deleteOne({_id: id});
        } catch (error) {

            throw new Error(
                `Se generó un error mientras eliminabamos el producto: ${error}`
            );

        }
    }
}