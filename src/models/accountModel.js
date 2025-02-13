const { Schema, model } = require("mongoose");

const accountSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    fullName: {
        type: String,
        required: [true, 'Please add your fullname']
    },
    businessName: {
        type: String,
        required: [true, 'Business name is needed']
    },
    address: {
        type: String,
        unique: true,
        required: [true, 'address is needed']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is needed']
    },
    password: {
        type: String,
        required: [true, 'Please add  your password']
    },
    role: {
        type: String,
        enum: ["admin", "owner", "user"],
        default: "user"
    },
    verification: {
        type: Boolean,
        default: false  //should be false
    },
    approval: {
        type: Number,
        default: null
    },
    phoneNumber: {
        type: Number,
        required: [true, 'Please add  your phone Number']
    }
}, { timestamps: true });

const AccountModel = model("Account", accountSchema);

module.exports = AccountModel