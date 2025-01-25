const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assessmentTypeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true }, // E.g., "Midterm", "Final Exam"
    description: { type: String }, // Optional description of the assessment type
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssessmentType", assessmentTypeSchema);
