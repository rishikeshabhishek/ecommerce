const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: "category"
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: "subcategory"
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

const ProductModel = new mongoose.model("product", ProductSchema);
module.exports = ProductModel;