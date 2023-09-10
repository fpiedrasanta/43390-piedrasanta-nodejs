import productModel from "../models/product.js";

export default class ProductRepository {
    constructor() { }

    getProducts = async (page, limit, sort, query) => {
        try {
            //return await productModel.find().lean();
            const options = {
                page: page || 1,
                limit: limit || 10,
                lean: true
            };
    
            const filter = query ? { 'title': { $regex: query, $options: 'i' } } : {};
    
            let sortOption = { 'title': 1 }; // Orden predeterminado ascendente por descripción
    
            if (sort === 'desc') {
                sortOption = { 'title': -1 }; // Orden descendente por descripción
            }
    
            const result = await productModel.paginate(filter, { ...options, sort: sortOption });
            return result;
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

    exists = async(code, id) => {
        try {
            // Busca un producto que tenga el mismo código pero un ID diferente al proporcionado
            const existingProduct = await productModel.findOne({ code, _id: { $ne: id } }).lean();
    
            // Si existe un producto con el mismo código y un ID diferente, retorna true, de lo contrario, retorna false
            return !!existingProduct;
        } catch (error) {
            throw new Error(`Se generó un error al verificar la existencia del producto: ${error}`);
        }
    }
}