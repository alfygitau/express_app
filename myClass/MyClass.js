const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema(
  {
    name: { type: String, required: true }, // Class name (e.g., "Grade 1A")
    grade: { type: String, required: true }, // Grade level (e.g., "Grade 10")
    classTeacher: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to Class Teacher (User)
    subjectTeachers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of Subject Teachers (User)
    students: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of Students (User)
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }], // Array of Subjects
    school: { type: Schema.Types.ObjectId, ref: "School", required: true }, // Link to School
    classLeaders: {
      maleLeader: { type: Schema.Types.ObjectId, ref: "User" }, // Male Class Leader (User)
      femaleLeader: { type: Schema.Types.ObjectId, ref: "User" }, // Female Class Leader (User)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
