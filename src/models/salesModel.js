import { Schema, model } from "mongoose";

export const salesSchema = new Schema({
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
        // enum: ["food", "transport", "home", "fun", "health", "other"],
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
    //     type: Boolean,
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

export const Sales = model("Sales", salesSchema);