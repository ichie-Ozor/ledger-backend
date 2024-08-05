import { Schema, model } from "mongoose";

export const verificationSchema = new Schema({
  userId: {
    type: String,
    unique: true
},
  uniqueString: {
    type: String,
    unique: true
},
  createdAt: {
    type: Date,
},
  expiresAt: {
    type: Date
  }
})

export const VerificationModel = model("Verification", verificationSchema)