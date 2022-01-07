const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CheckOutSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    product: [{
        type: Schema.Types.ObjectId,
        ref: "product"
    }],
    quantity: [{
        type: Number,
        required: true
    }],
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    },
    shipping: {
        type: Number,
        required: true,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    token: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: false
    },
    paymentType: {
        type: String,
        default: ""
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
})

const CheckOutModel = new mongoose.model("checkout", CheckOutSchema);
module.exports = CheckOutModel;