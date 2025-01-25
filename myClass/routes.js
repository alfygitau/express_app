const express = require("express");

const User = require("../users/User");
const School = require("../school/School");
const Class = require("./MyClass");
const Subject = require("../subject/Subject");

const router = express.Router();

router.post("/classes", async (req, res) => {
  const {
    name,
    grade,
    classTeacherId,
    subjectTeacherIds,
    students,
    subjects,
    schoolId,
    maleLeaderId,
    femaleLeaderId,
  } = req.body;

  try {
    // Check if class teacher exists and is a teacher
    const classTeacher = await User.findById(classTeacherId);
    if (!classTeacher || classTeacher.role !== "teacher") {
      return res.status(400).json({ error: "Invalid class teacher ID" });
    }

    // Check if all subject teachers exist and are teachers
    for (let teacherId of subjectTeacherIds) {
      const subjectTeacher = await User.findById(teacherId);
      if (!subjectTeacher || subjectTeacher.role !== "teacher") {
        return res
          .status(400)
          .json({ error: `Invalid subject teacher ID: ${teacherId}` });
      }
    }

    // Check if all students exist and are students
    for (let studentId of students) {
      const student = await User.findById(studentId);
      if (!student || student.role !== "student") {
        return res
          .status(400)
          .json({ error: `Invalid student ID: ${studentId}` });
      }
    }

    // Check if the leaders (male and female) exist and are students
    if (maleLeaderId) {
      const maleLeader = await User.findById(maleLeaderId);
      if (!maleLeader || maleLeader.role !== "student") {
        return res.status(400).json({ error: "Invalid male leader" });
      }
    }

    if (femaleLeaderId) {
      const femaleLeader = await User.findById(femaleLeaderId);
      if (!femaleLeader || femaleLeader.role !== "student") {
        return res.status(400).json({ error: "Invalid female leader" });
      }
    }

    // Check if the school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(400).json({ error: "Invalid school ID" });
    }

    // Ensure all subjects exist
    for (let subjectId of subjects) {
      const subject = await Subject.findById(subjectId);
      if (!subject) {
        return res
          .status(400)
          .json({ error: `Subject with ID ${subjectId} does not exist` });
      }
    }

    // Create the new class
    const newClass = new Class({
      name,
      grade,
      classTeacher: classTeacherId, // Assign class teacher
      subjectTeachers: subjectTeacherIds, // Assign subject teachers
      students,
      subjects, // Assign subjects (array of subject IDs)
      school: schoolId,
      classLeaders: {
        maleLeader: maleLeaderId, // Assign male leader
        femaleLeader: femaleLeaderId, // Assign female leader
      },
    });

    // Save the class to the database
    await newClass.save();

    // Return the created class
    res.status(201).json({
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/classes - Get all classes
router.get("/classes", async (req, res) => {
  try {
    // Find all classes from the database
    const classes = await Class.find()
      .populate("classTeacher") // Populate classTeacher details
      .populate("subjectTeachers") // Populate subjectTeachers details
      .populate("students") // Populate students details
      .populate("subjects") // Populate subjects details
      .populate("school") // Populate school details
      .populate("classLeaders.maleLeader") // Populate male leader details
      .populate("classLeaders.femaleLeader"); // Populate female leader details

    if (!classes || classes.length === 0) {
      return res.status(404).json({ message: "No classes found" });
    }

    // Return the list of classes
    res.status(200).json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/classes/:id - Update a class
router.put("/classes/:id", async (req, res) => {
  const {
    name,
    grade,
    classTeacherId,
    subjectTeacherIds,
    students,
    subjects,
    schoolId,
    maleLeaderId,
    femaleLeaderId,
  } = req.body;

  try {
    // Find the class by ID
    const existingClass = await Class.findById(req.params.id);
    if (!existingClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Check if class teacher is provided and is valid
    if (classTeacherId) {
      const classTeacher = await User.findById(classTeacherId);
      if (!classTeacher || classTeacher.role !== "teacher") {
        return res.status(400).json({ error: "Invalid class teacher ID" });
      }
      existingClass.classTeacher = classTeacherId;
    }

    // Check if subject teachers are provided and are valid
    if (subjectTeacherIds) {
      for (let teacherId of subjectTeacherIds) {
        const subjectTeacher = await User.findById(teacherId);
        if (!subjectTeacher || subjectTeacher.role !== "teacher") {
          return res
            .status(400)
            .json({ error: `Invalid subject teacher ID: ${teacherId}` });
        }
      }
      existingClass.subjectTeachers = subjectTeacherIds;
    }

    // Check if students are provided and are valid
    if (students) {
      for (let studentId of students) {
        const student = await User.findById(studentId);
        if (!student || student.role !== "student") {
          return res
            .status(400)
            .json({ error: `Invalid student ID: ${studentId}` });
        }
      }
      existingClass.students = students;
    }

    // Check if leaders (male and female) are provided and are students
    if (maleLeaderId) {
      const maleLeader = await User.findById(maleLeaderId);
      if (!maleLeader || maleLeader.role !== "student") {
        return res.status(400).json({ error: "Invalid male leader" });
      }
      existingClass.classLeaders.maleLeader = maleLeaderId;
    }

    if (femaleLeaderId) {
      const femaleLeader = await User.findById(femaleLeaderId);
      if (!femaleLeader || femaleLeader.role !== "student") {
        return res.status(400).json({ error: "Invalid female leader" });
      }
      existingClass.classLeaders.femaleLeader = femaleLeaderId;
    }

    // Check if the school exists (optional for partial updates)
    if (schoolId) {
      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(400).json({ error: "Invalid school ID" });
      }
      existingClass.school = schoolId;
    }

    // Check if the name is provided, update only if the name exists in the body
    if (name) {
      existingClass.name = name;
    }

    // If grade is provided, update it
    if (grade) {
      existingClass.grade = grade;
    }

    // Save the updated class
    await existingClass.save();

    // Return the updated class
    res.status(200).json({
      message: "Class updated successfully",
      class: existingClass,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/classes/:id - Delete a class
router.delete("/classes/:id", async (req, res) => {
  try {
    // Find and delete the class by ID
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Return a success message
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
