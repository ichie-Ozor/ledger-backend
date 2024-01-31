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
        type: String,
        enum: ["food", "transport", "home", "fun", "health", "other"],
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