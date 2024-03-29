import { Schema, model } from "mongoose";

export const creditSchema = new Schema({
    creditorId: {
        type: Schema.Types.ObjectId,
        ref: "Creditor",
        required: true
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Animal', 'Cotton', 'Food', 'Tools',"food", "transport", "home", "fun", "health", "other"],
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
    // paid: {
    //     type: Number,
    //     required: true
    // },
    // balance: {
    //     type: Number,
    //     required: true
    // },
    date: {
        type: Date,
        required: true
    }
    }, {timestamps: true});

export const Credit = model("Credit", creditSchema);