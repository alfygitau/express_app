const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    academicYear: { type: String, required: true },
    assessments: [
      {
        subject: {
          type: Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        assessments: [
          {
            assessmentType: {
              type: Schema.Types.ObjectId,
              ref: "AssessmentType",
              required: true,
            },
            marks: { type: Number, required: true },
            grade: {
              type: String,
              enum: ["A", "B", "C", "D", "E"],
              required: true,
            },
            marksDescription: {
              type: String,
              enum: ["Poor", "Average", "Above Average", "Good", "Excellent"],
            },
            totalPossibleScore: { type: Number, required: true },
          },
        ],
      },
    ],
    cumulativePoints: { type: Number, required: true },
    attendance: { type: Number },
    behavior: { type: String },
    overallGrade: { type: String },
    dateGenerated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
