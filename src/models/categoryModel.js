const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    name: {
        // type: Schema.Types.ObjectId,
        type: String,
        required: true
    }
}, { timestamps: true });

const Category = model("Category", categorySchema);

module.exports = Category;