const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponSchema = Schema({
    couponCode: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

const CouponModel = mongoose.model("coupon", CouponSchema);
module.exports = CouponModel;