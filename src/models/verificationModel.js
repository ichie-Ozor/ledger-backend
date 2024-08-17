const { Schema, model } = require("mongoose");

const verificationSchema = new Schema({
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

const VerificationModel = model("Verification", verificationSchema)

module.exports = VerificationModel