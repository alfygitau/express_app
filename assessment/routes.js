const express = require("express");
const router = express.Router();
const AssessmentType = require("./Assessment"); // Assuming the model is in models folder

// Add a new assessment type
router.post("/assessments", async (req, res) => {
  const { name, description } = req.body;

  try {
    const existingAssessmentType = await AssessmentType.findOne({ name });
    if (existingAssessmentType) {
      return res.status(400).json({ error: "Assessment type already exists" });
    }

    const newAssessmentType = new AssessmentType({ name, description });
    await newAssessmentType.save();
    res.status(201).json({
      message: "Assessment type added successfully",
      assessmentType: newAssessmentType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update an assessment type
router.put("/assessment-types/:id", async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  try {
    const assessmentType = await AssessmentType.findById(id);
    if (!assessmentType) {
      return res.status(404).json({ error: "Assessment type not found" });
    }

    assessmentType.name = name || assessmentType.name;
    assessmentType.description = description || assessmentType.description;

    await assessmentType.save();
    res.status(200).json({
      message: "Assessment type updated successfully",
      assessmentType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete an assessment type
router.delete("/assessment-types/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const assessmentType = await AssessmentType.findById(id);
    if (!assessmentType) {
      return res.status(404).json({ error: "Assessment type not found" });
    }

    await assessmentType.remove();
    res.status(200).json({ message: "Assessment type deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all assessment types
router.get("/assessment-types", async (req, res) => {
  try {
    const assessmentTypes = await AssessmentType.find();
    res.status(200).json({ assessmentTypes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
