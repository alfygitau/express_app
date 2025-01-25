const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User" },
    academicYear: { type: String, required: true },
    subjects: [
      {
        subject: { type: Schema.Types.ObjectId, ref: "Subject" },
        marks: { type: Number },
        grade: { type: String },
      },
    ],
    attendance: { type: Number }, // Percentage attendance
    behavior: { type: String }, // Textual report on behavior
    overallGrade: { type: String }, // Final grade (A, B, C, etc.)
    dateGenerated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
