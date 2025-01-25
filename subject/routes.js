const { body, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();
const Subject = require("../subject/Subject");
const User = require("../users/User");
const School = require("../school/School");

// Create a new subject with validation
router.post(
  "/subjects",
  [
    // Validate the name of the subject
    body("name")
      .notEmpty()
      .withMessage("Subject name is required")
      .isString()
      .withMessage("Subject name must be a string"),

    // Validate the code
    body("code")
      .notEmpty()
      .withMessage("Subject code is required")
      .isString()
      .withMessage("Subject code must be a string")
      .isLength({ min: 3, max: 10 })
      .withMessage("Subject code must be between 3 and 10 characters"),

    // Validate the teachers (array of teacher IDs)
    body("teachers")
      .isArray()
      .withMessage("Teachers must be an array of teacher IDs")
      .notEmpty()
      .withMessage("At least one teacher must be assigned to the subject")
      .custom(async (teachers) => {
        // Validate each teacher ID
        for (let teacherId of teachers) {
          const teacher = await User.findById(teacherId);
          if (!teacher || teacher.role !== "teacher") {
            throw new Error(
              `Teacher ID ${teacherId} is invalid or not a teacher`
            );
          }
        }
        return true;
      }),

    // Validate the schoolId
    body("schoolId")
      .notEmpty()
      .withMessage("School ID is required")
      .isMongoId()
      .withMessage("School ID must be a valid MongoDB ObjectId"),

    // Optionally validate the description (if provided)
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
  ],
  async (req, res) => {
    // Collect validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, code, description, teachers, schoolId } = req.body;

    try {
      // Check if the school exists
      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(400).json({ error: "Invalid school ID" });
      }

      // Create the new subject
      const newSubject = new Subject({
        name,
        code,
        description,
        teachers,
        school: schoolId,
      });

      // Save the subject to the database
      await newSubject.save();

      // Return the created subject
      res.status(201).json({
        message: "Subject created successfully",
        subject: newSubject,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get all subjects
router.get("/subjects", async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("teachers", "name email") // Populate the teacher details
      .populate("school", "name"); // Populate the school details

    res.status(200).json({ subjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a subject by ID
router.get("/subjects/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const subject = await Subject.findById(id)
      .populate("teachers", "name email") // Populate teacher details
      .populate("school", "name"); // Populate school details

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.status(200).json({ subject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a subject by ID
router.put(
  "/subjects/:id",
  [
    // Validate name
    body("name")
      .optional()
      .isString()
      .withMessage("Subject name must be a string"),

    // Validate code
    body("code")
      .optional()
      .isString()
      .withMessage("Subject code must be a string")
      .isLength({ min: 3, max: 10 })
      .withMessage("Subject code must be between 3 and 10 characters"),

    // Validate teachers array
    body("teachers")
      .optional()
      .isArray()
      .withMessage("Teachers must be an array of teacher IDs")
      .custom(async (teachers) => {
        for (let teacherId of teachers) {
          const teacher = await User.findById(teacherId);
          if (!teacher || teacher.role !== "teacher") {
            throw new Error(
              `Teacher ID ${teacherId} is invalid or not a teacher`
            );
          }
        }
        return true;
      }),

    // Validate schoolId
    body("schoolId")
      .optional()
      .isMongoId()
      .withMessage("School ID must be a valid MongoDB ObjectId"),

    // Optionally validate description
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
  ],
  async (req, res) => {
    const { id } = req.params;
    const { name, code, description, teachers, schoolId } = req.body;

    // Collect validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Find the subject by ID
      const subject = await Subject.findById(id);
      if (!subject) {
        return res.status(404).json({ error: "Subject not found" });
      }

      // Optionally update the schoolId
      if (schoolId) {
        const school = await School.findById(schoolId);
        if (!school) {
          return res.status(400).json({ error: "Invalid school ID" });
        }
        subject.school = schoolId; // Update school if passed
      }

      // Update the other fields
      if (name) subject.name = name;
      if (code) subject.code = code;
      if (description) subject.description = description;
      if (teachers) subject.teachers = teachers;

      // Save the updated subject
      await subject.save();

      // Return the updated subject
      res.status(200).json({
        message: "Subject updated successfully",
        subject,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Delete a subject by ID
router.delete("/subjects/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the subject by ID
      const subject = await Subject.findById(id);
      if (!subject) {
        return res.status(404).json({ error: "Subject not found" });
      }
  
      // Delete the subject
      await subject.remove();
  
      res.status(200).json({
        message: "Subject deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
module.exports = router;
