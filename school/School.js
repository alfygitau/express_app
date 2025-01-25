const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schoolSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String },
    email: { type: String },
    website: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("School", schoolSchema);
