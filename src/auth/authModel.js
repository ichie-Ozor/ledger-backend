import { Schema, model } from "mongoose";

const authSchema = new Schema({
   fullName: {
    type: String,
    required: [true, 'Please add your fullname']
   },
   businessName: {
    type: String,
    required: [true, 'Business name is needed']
   },
   email: {
    type: String,
    unique: true,
    required: [true, 'email is needed']
   },
   password: {
    type: String,
    required: [true, 'Please add  your password']
   }, 
   role: {
    type: String,
    enum: ["admin", "owner", "user"]
   },
   verification: {
      type: Boolean,
      default: true  //should be false
   }
}, {timestamps: true});

export const AuthModel = model ("Authentication", authSchema)