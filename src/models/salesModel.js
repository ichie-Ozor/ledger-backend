const { Schema, model } = require("mongoose");

const salesSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    description: {
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
    rate: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Sales = model("Sales", salesSchema);

module.exports = Sales