import { Schema, model } from "mongoose";

export const stockSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    goods: {
        type: String,
        required: true
    },
    category: {
        // type: Schema.Types.ObjectId,
        type: String,
        ref: 'Category',
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    }, {timestamps: true});

export const Stock = model("Stock", stockSchema);