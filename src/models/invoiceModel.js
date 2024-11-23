const { Schema, model } = require('mongoose');

const invoiceSchema = new Schema({
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
    invoiceId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
    },
    paymentMethod: {
        type: String,
        required: true
    },
    businessPhoneNumber: {
        type: Number,
        required: true
    },
    creditroPhoneNumber: {
        type: Number
    },
    businessName: {
        type: String,
        required: true
    },
    ownerName: {
        type: String,
        required: true
    },
    creditorFirstName: {
        type: String,
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
    unit: {
        type: String,
    },
    total: {
        type: Number,
        required: true
    }

}, { timestamps: true });

const Invoice = model("Invoice", invoiceSchema);

module.exports = Invoice