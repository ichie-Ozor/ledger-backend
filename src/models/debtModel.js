const { Schema, model } = require("mongoose");

const debtSchema = new Schema({
    debtorId: {
        type: Schema.Types.ObjectId,
        ref: "Debtor",
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
}, { timestamps: true });

const Debt = model("Debt", debtSchema);

module.exports = Debt