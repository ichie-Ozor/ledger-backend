import { Schema, model } from "mongoose";

export const salesSchema = new Schema({
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
    salingPrice: {
        type: Number,
        required: true
    },
    }, {timestamps: true});

export const Sales = model("Sales", salesSchema);