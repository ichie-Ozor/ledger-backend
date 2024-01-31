import { Schema, model } from "mongoose";

export const categorySchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
    }, {timestamps: true});

export const Category = model("Category", categorySchema);