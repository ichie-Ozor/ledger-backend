import { Schema, model } from 'mongoose';

export const profileSchema = new Schema({
    account: { 
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Account id is needed"]
    },
    firstName: {
        type: String,
        required: [true, "first name is needed"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is needed"]
    },
    businessName: {
        type: String,
        required: [true, "Please a business name"]
    },
    password: {
        type: String,
        required: [true, "Please a password"]
    }
}, {timestamps: true});

export const ProfileModel = model("Profile", profileSchema);