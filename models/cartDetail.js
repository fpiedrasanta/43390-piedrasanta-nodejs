import Product from "./product.js";

export default class CartDetail {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    static fromObject(obj) {
        return new CartDetail(
            Product.fromObject(obj.product),
            obj.quantity
        );
    }

    getProduct = () => this.product;

    getQuantity = () => this.quantity;

    addQuantity = (quantity) => {
        this.quantity += quantity;
    }
}