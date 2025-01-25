const express = require("express");
const User = require("../users/User");
const Marks = require("../marks/Marks");
const Subject = require("../subject/Subject");
const School = require("../school/School");
const AssessmentType = require("../assessment/Assessment");
const router = express.Router();

router.post("/marks", async (req, res) => {
  const {
    student,
    subject,
    subjectTeacher,
    marks,
    assessmentType: assessmentTypeId,
    grade,
    marksDescription,
    school,
  } = req.body;

  try {
    const assessmentType = await AssessmentType.findById(assessmentTypeId);
    if (!assessmentType) {
      return res.status(400).json({ error: "Invalid assessment type" });
    }

    // Check if the student exists and is a student
    const studentExists = await User.findById(student);
    if (!studentExists || studentExists.role !== "student") {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    // Check if the subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return res.status(400).json({ error: "Invalid subject ID" });
    }

    // Check if the subject teacher exists
    const teacherExists = await User.findById(subjectTeacher);
    if (!teacherExists || teacherExists.role !== "teacher") {
      return res.status(400).json({ error: "Invalid subject teacher ID" });
    }

    // Check if the school exists
    const schoolExists = await School.findById(school);
    if (!schoolExists) {
      return res.status(400).json({ error: "Invalid school ID" });
    }

    // Create the new marks entry
    const newMarks = new Marks({
      student,
      subject,
      subjectTeacher,
      marks,
      grade,
      marksDescription,
      assessmentType: assessmentTypeId,
      school,
    });

    // Save to the database
    await newMarks.save();

    // Return the created marks
    res.status(201).json({
      message: "Marks created successfully",
      marks: newMarks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to get all marks for all students
router.get("/marks", async (req, res) => {
  try {
    // Fetch all marks and populate related fields
    const marks = await Marks.find()
      .populate("student", "name email") // Populate student name and email
      .populate("subject", "name code") // Populate subject name and code
      .populate("subjectTeacher", "name email") // Populate subject teacher name and email
      .populate("school", "name location"); // Populate school name and location

    if (!marks || marks.length === 0) {
      return res.status(404).json({ message: "No marks found" });
    }

    res.status(200).json({ marks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/marks/:studentId", async (req, res) => {
  const { studentId } = req.params;

  try {
    const marks = await Marks.find({ student: studentId })
      .populate("subject")
      .populate("subjectTeacher")
      .populate("school");

    if (!marks) {
      return res.status(404).json({ error: "No marks found for this student" });
    }

    res.status(200).json({ marks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/marks/:id", async (req, res) => {
  const { id } = req.params;
  const { marks, grade, marksDescription } = req.body;

  try {
    const updatedMarks = await Marks.findByIdAndUpdate(
      id,
      { marks, grade, marksDescription },
      { new: true }
    );

    if (!updatedMarks) {
      return res.status(404).json({ error: "Marks not found" });
    }

    res.status(200).json({
      message: "Marks updated successfully",
      marks: updatedMarks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/marks/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMarks = await Marks.findByIdAndDelete(id);

    if (!deletedMarks) {
      return res.status(404).json({ error: "Marks not found" });
    }

    res.status(200).json({ message: "Marks deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
