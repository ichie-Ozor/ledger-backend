const { Schema, model } = require('mongoose');

const creditorBalSchema = new Schema({
    creditorId: {
        type: Schema.Types.ObjectId,
        ref: "Creditor",
        required: true
    },
    businessId: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    balance: {
        type: Number,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    paid: {
        type: Number,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    purchase: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const CreditorBal = model("CreditorBal", creditorBalSchema)

module.exports = CreditorBal