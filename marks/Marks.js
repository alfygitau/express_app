const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const marksSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Link to the Student (User)
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    assessmentType: { type: Schema.Types.ObjectId, ref: "AssessmentType" }, // Link to the Subject
    subjectTeacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Link to the Subject Teacher (User)
    marks: { type: Number, required: true }, // The actual marks obtained by the student
    grade: {
      type: String,
      enum: ["A", "B", "C", "D", "E", "Y"], // Grade options
      required: true,
    },
    marksDescription: {
      type: String,
      enum: ["Poor", "Average", "Above Average", "Good", "Excellent"], // Marks description options
      required: true,
    },
    totalSubjectScore: { type: Number, default: 100, required: true },
    date: { type: Date, default: Date.now }, // Date when the marks are recorded
    school: { type: Schema.Types.ObjectId, ref: "School", required: true }, // Link to the School
  },
  { timestamps: true }
);

module.exports = mongoose.model("Marks", marksSchema);
