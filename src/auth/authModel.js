import { Schema, model } from "mongoose";

const authSchema = new Schema({
    email: {
    type: String,
    unique: true,
    required: [true, 'email is needed']
   },
   password: {
    type: String,
    required: [true, 'Please add  your password']
   },
   verification: {
      type: Boolean,
      default: true  //should be false
   }
}, {timestamps: true});

export const AuthModel = model ("Authentication", authSchema)