import mongoose from "mongoose";

const collection = "products";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: Array,
        required: false,
        default: []
    },
    code: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
}, {timestamps: true});

const productModel = mongoose.model(collection, schema);

export default productModel;

