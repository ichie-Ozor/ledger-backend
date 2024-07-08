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
  createAt: {
    type: Date,
},
  expiredAt: {
    type: Date
  }
})

export const VerificationModel = medol("Verification", verificationSchema)