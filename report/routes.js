const express = require("express");
const User = require("../users/User");
const Marks = require("../marks/Marks");
const Report = require("../report/Report");

const router = express.Router();

// Helper function to calculate grade based on marks
const calculateGrade = (marks, totalPossibleScore) => {
  const percentage = (marks / totalPossibleScore) * 100;
  if (percentage >= 90) return "A";
  else if (percentage >= 80) return "B";
  else if (percentage >= 70) return "C";
  else if (percentage >= 60) return "D";
  else return "E";
};

router.post("/student-report", async (req, res) => {
  const { studentId, academicYear, attendance, behavior } = req.body;
  try {
    // Step 1: Validate the provided data (e.g., check if the student exists)
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    // Step 2: Fetch marks data for the student from the Marks collection
    const marksData = await Marks.find({ student: studentId })
      .populate("subject")
      .populate("assessmentType");

    if (marksData.length === 0) {
      return res.status(400).json({ error: "Student lacks any marks data" });
    }

    // Step 3: Initialize the assessments array for the report
    const assessmentsGroupedBySubject = {};

    // Iterate over each marks entry to generate assessments and group by subject
    for (const markEntry of marksData) {
      const {
        subject,
        assessmentType,
        marks,
        totalSubjectScore,
        marksDescription,
      } = markEntry;

      // If the subject is not already in the assessments object, initialize it
      if (!assessmentsGroupedBySubject[subject._id]) {
        assessmentsGroupedBySubject[subject._id] = {
          subject: subject._id,
          assessments: [],
        };
      }

      // Push the assessment to the corresponding subject group
      assessmentsGroupedBySubject[subject._id].assessments.push({
        assessmentType: assessmentType._id,
        marks,
        grade: calculateGrade(marks, totalSubjectScore),
        marksDescription,
        totalPossibleScore: totalSubjectScore,
      });
    }

    // Step 4: Generate the assessments array for the report
    const assessments = Object.values(assessmentsGroupedBySubject);

    // Step 5: Calculate cumulative points for the report
    let cumulativePoints = 0;
    for (const subjectData of assessments) {
      subjectData.assessments.forEach((assessment) => {
        cumulativePoints += assessment.marks;
      });
    }

    // Step 6: Calculate the overall grade based on cumulative points
    const totalPossiblePoints = marksData.length * 100; // Assuming each assessment has a max of 100 marks
    const overallPercentage = (cumulativePoints / totalPossiblePoints) * 100;

    let finalOverallGrade = "";
    if (overallPercentage >= 90) finalOverallGrade = "A";
    else if (overallPercentage >= 80) finalOverallGrade = "B";
    else if (overallPercentage >= 70) finalOverallGrade = "C";
    else if (overallPercentage >= 60) finalOverallGrade = "D";
    else finalOverallGrade = "E";

    // Step 7: Create the report object
    const report = new Report({
      student: studentId,
      academicYear,
      assessments, // Grouped assessments array
      cumulativePoints,
      attendance,
      behavior,
      overallGrade: finalOverallGrade,
      dateGenerated: Date.now(),
    });

    // Step 8: Save the report to the database
    await report.save();

    // Return the created report
    res.status(200).json({
      message: "Report generated successfully",
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
