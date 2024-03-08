import { Schema, model } from "mongoose";

export const categorySchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    name: {
        // type: Schema.Types.ObjectId,
        type: String,
        required: true
    }
    }, {timestamps: true});

export const Category = model("Category", categorySchema);