import { Schema, model } from "mongoose";

export const accountSchema = new Schema({
    fullName: {
        type: String,
        ref: "Account",
        required: [true, 'Please add your fullname']
    },
    businessName: {
        type: String,
        required: [true, 'Business name is needed']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'email is needed']
    },
    password: {
        type: String,
        required: [true, 'Please add  your password']
        },
    role: {
        type: String,
        enum: ["admin", "owner", "user"],
        default: "user"
    },
    verification: {
        type: Boolean,
        default: true  //should be false
     }
    }, {timestamps: true});

export const Account = model("Account", salesSchema);