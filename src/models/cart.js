import CartDetail from "./cartDetail.js";

//Clase producto
export default class Cart {
    constructor(id, cartDetails) {
        this.id = id;
        this.cartDetails = cartDetails;
    }

    static fromObject(obj) {
        let cartDetails = [];

        obj.cartDetails.forEach((cartDetail) => {
            cartDetails.push(CartDetail.fromObject(cartDetail));
        });
        
        return new Cart(
            obj.id,
            cartDetails
        );
    }

    getId = () => this.id;
    
    getCartDetails = () => this.cartDetails;

    getCartDetail = (product) => {
        return this.cartDetails.find(x => x.product.id === product.id);
    }

    addCartDetail = (product, quantity) => {
        const cartDetail = this.getCartDetail(product);
        if(cartDetail) {
            cartDetail.addQuantity(1);
        } else {
            this.cartDetails.push(new CartDetail({ id: product.id }, quantity));
        }
    }
}