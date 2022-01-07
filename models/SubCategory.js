const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubCatSchema = new Schema({
    subCategory: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "category"
    }
})

const SubCatModel = new mongoose.model("subcategory", SubCatSchema);
module.exports = SubCatModel;