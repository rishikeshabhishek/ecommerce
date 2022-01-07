const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "product"
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
})

const CartModel = new mongoose.model("cart", CartSchema);
module.exports = CartModel;