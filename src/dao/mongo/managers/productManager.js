import ProductRepository from "../repository/productRepository.js";
import Result from "../../../helper/result.js";

//Clase ProductManager
export default class ProductManager {
    #productRepository

    constructor(path) {
        this.productRepository = new ProductRepository();
    }

    getProducts = async (page, limit, sort, query) => {
        try {
            const products = await this.productRepository.getProducts(page, limit, sort, query);
            return new Result(200, true, "success", [], products);
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }

    validateProduct = async (product) => {
        let errors = [];
        
        const exists = await this.productRepository.exists(product.code, product._id);

        if(exists)
        {
            errors.push(`Ya existe un producto con código ${product.code}`);
        }

        if(product.title.trim() === "") {
            errors.push("Debe asignar un title al producto");
        }

        if(product.description.trim() === "") {
            errors.push("Debe asignar una descripción al producto");
        }

        if(product.price <= 0) {
            errors.push("El producto debe tener un valor mayor a 0");
        }

        if(product.thumbnail.trim() === "") {
            errors.push("El producto debe tener una imagen");
        }

        if(product.code.trim() === "") {
            errors.push("El producto debe tener un código");
        }

        if(product.stock < 0) {
            errors.push("El stock del producto debe ser 0 o mayor que 0");
        }

        return errors;
    }

    addProduct = async (product) => {
        try {
            const errors = await this.validateProduct(product);

            if(errors.length > 0)
            {
                return new Result(
                    400, 
                    false, 
                    'Error al agregar un producto', 
                    errors, 
                    null);
            }

            const newProduct = await this.productRepository.addProduct(product);

            return new Result(200, 
                true, 
                "El producto se agregó con éxito", 
                [], 
                newProduct);
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }

    getProductById = async (id) => {
        try {
            const product = await this.productRepository.getProductById(id);
            if(product) {
                return new Result(
                    200, 
                    true, 
                    "success", 
                    [], 
                    product);
            } else {
                return new Result(
                    404, 
                    false, 
                    "No se encontró el producto", 
                    [], 
                    null);
            }
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }

    updateProduct = async (product) => {
        try {
            const dbProduct = await this.productRepository.getProductById(product._id);

            if(dbProduct == null) {
                return new Result(
                    404, 
                    false, 
                    "El producto no existe en la base de datos", 
                    [], 
                    null);
            }

            const errors = await this.validateProduct(product);

            if(errors.length > 0)
            {
                return new Result(
                    400,
                    false, 
                    'No se pudo actualizar el producto', 
                    errors, 
                    null);
            }

            await this.productRepository.updateProduct(product);

            return new Result(
                200, 
                true, 
                "El producto se actualizó con éxito", 
                [], 
                product);
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }

    deleteProduct = async (product) => {
        try {
            const dbProduct = await this.productRepository.getProductById(product._id);

            if(dbProduct == null) {
                return new Result(
                    404,
                    false, 
                    "El producto no existe en la base de datos", 
                    []);
            }

            await this.productRepository.deleteProduct(product._id);

            return new Result(
                200,
                true, 
                "El producto se eliminó con éxito", 
                []);
        } catch (error) {
            return new Result(500, false, error.message, [], null);
        }
    }
}