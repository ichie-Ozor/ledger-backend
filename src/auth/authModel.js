const { Schema, model } = require("mongoose");

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
}, { timestamps: true });

const AuthModel = model("Authentication", authSchema)

module.exports = AuthModel; 