const { Schema, model } = require("mongoose");

const creditSchema = new Schema({
    creditorId: {
        type: Schema.Types.ObjectId,
        ref: "Creditor",
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
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Credit = model("Credit", creditSchema);

module.exports = Credit