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
    creditorLastName: {
        type: String
    },

})