const { Schema, model } = require('mongoose');

const debtorBalSchema = new Schema({
    debtorId: {
        type: Schema.Types.ObjectId,
        ref: "Debtor",
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

const DebtorBal = model("DebtorBal", debtorBalSchema)

module.exports = DebtorBal