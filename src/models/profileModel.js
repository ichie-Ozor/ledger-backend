const { Schema, model } = require('mongoose');

const profileSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Account id is needed"]
    },
    name: {
        type: String,
        required: [true, "name is needed"]
    },
    address: {
        type: String,
        required: [true, "Business address is needed"]
    },
    businessName: {
        type: String,
        required: [true, "Please a business name"]
    },
    password: {
        type: String,
        required: [true, "Please a password"]
    },
    file: {
        type: String,
    }
}, { timestamps: true });

const ProfileModel = model("Profile", profileSchema);

module.exports = ProfileModel