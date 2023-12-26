import { Schema, model } from "mongoose";

export const accountSchema = new Schema({
    fullName: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    businessName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
        },
    role: {
        type: String,
        enum: ["admin", "owner", "user"],
        default: "user"
    },
    }, {timestamps: true});

export const Account = model("Account", salesSchema);