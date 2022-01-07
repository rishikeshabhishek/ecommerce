const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    contactNo: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const UserSchema = new mongoose.model("user", User);
module.exports = UserSchema;