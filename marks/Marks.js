const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const marksSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User" },
    subject: { type: Schema.Types.ObjectId, ref: "Subject" },
    marks: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    school: { type: Schema.Types.ObjectId, ref: "School", required: true }, // Link to School
  },
  { timestamps: true }
);

module.exports = mongoose.model("Marks", marksSchema);
