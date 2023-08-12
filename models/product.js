//Clase producto
export default class Product {
    constructor(id, title, description, price, thumbnail, code, stock)
    {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }

    static fromObject(obj) {
        return new Product(
            obj.id,
            obj.title,
            obj.description,
            obj.price,
            obj.thumbnail,
            obj.code,
            obj.stock
        );
    }
}