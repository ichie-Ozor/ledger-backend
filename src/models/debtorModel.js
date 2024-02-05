import { Schema, model } from "mongoose";

export const debtorSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
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
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    }
    }, {timestamps: true});

export const Debtor = model("Debtor", debtorSchema);