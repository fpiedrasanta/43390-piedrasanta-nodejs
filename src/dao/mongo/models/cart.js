import mongoose from "mongoose";

const collection = "carts";

const productsSubschema = mongoose.Schema({
    product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'products'
    },
    quantity: {
        type: Number,
        required: true
    }
}, {_id:false});

const schema = new mongoose.Schema({
    products: [productsSubschema]
}, {timestamps: true});

const cartModel = mongoose.model(collection, schema);

export default cartModel;