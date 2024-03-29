import { Schema, model } from "mongoose";

export const creditorSchema = new Schema({
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
        required: true,
        unique: true
    },
    businessName: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    }
    }, {timestamps: true});

export const Creditor = model("Creditor", creditorSchema);