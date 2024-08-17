const { Schema, model } = require("mongoose");

const creditorSchema = new Schema({
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
}, { timestamps: true });

const Creditor = model("Creditor", creditorSchema);

module.exports = Creditor