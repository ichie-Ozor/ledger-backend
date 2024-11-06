const { Schema, model } = require("mongoose");

const stockSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    goods: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    pcs: {
        type: Number,
        required: true,
        default: 1
    },
    crt: {
        type: Number,
        required: true,
        default: 0
    },
    cost: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
}, { timestamps: true });

const Stock = model("Stock", stockSchema);

module.exports = Stock