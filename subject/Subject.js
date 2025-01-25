const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Subject schema
const subjectSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, unique: true, required: true },
    description: { type: String },
    teachers: [
      { type: Schema.Types.ObjectId, ref: "User", required: true }, // Array of teacher references
    ],
    school: { type: Schema.Types.ObjectId, ref: "School", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);
