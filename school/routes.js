const express = require("express");
const { body, validationResult } = require("express-validator");
const School = require("./School");

const router = express.Router();

// Route to get all schools
router.get("/all-schools", async (req, res) => {
  try {
    // Fetch all schools from the database
    const schools = await School.find();

    // If no schools are found
    if (schools.length === 0) {
      return res.status(404).json({ message: "No schools found" });
    }

    // Send back the list of schools
    res.status(200).json({
      message: "Schools retrieved successfully",
      schools: schools,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/schools/:id", async (req, res) => {
  const { id } = req.params; // Get the school ID from the URL parameter

  try {
    // Find the school by its ID
    const school = await School.findById(id);

    // If the school is not found
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    // Send back the found school
    res.status(200).json({
      message: "School retrieved successfully",
      school: school,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to create a new school
router.post(
  "/schools/create",
  [
    body("name").notEmpty().withMessage("School name is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
    body("email").isEmail().withMessage("Please enter a valid email address"),
  ],
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, address, phoneNumber, email, website } = req.body;

    try {
      // Check if school with the same email exists
      const existingSchool = await School.findOne({ email });
      if (existingSchool) {
        return res
          .status(400)
          .json({ error: "A school with this email already exists" });
      }

      // Create a new school
      const newSchool = new School({
        name,
        address,
        phoneNumber,
        email,
        website,
      });

      // Save the school to the database
      await newSchool.save();

      // Send response
      res.status(201).json({
        message: "School created successfully",
        school: {
          id: newSchool._id,
          name: newSchool.name,
          address: newSchool.address,
          phoneNumber: newSchool.phoneNumber,
          email: newSchool.email,
          website: newSchool.website,
          created_at: newSchool.createdAt,
          updated_at: newSchool.updatedAt,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Route to update an existing school
router.put(
  "/schools/:id", // :id is the dynamic parameter representing the school's ID
  [
    body("name").optional().notEmpty().withMessage("School name is required"),
    body("address").optional().notEmpty().withMessage("Address is required"),
    body("phoneNumber")
      .optional()
      .notEmpty()
      .withMessage("Phone number is required"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please enter a valid email address"),
  ],
  async (req, res) => {
    const { id } = req.params; // Get the school ID from the URL parameter
    const { name, address, phoneNumber, email, website } = req.body;

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Find the school by ID
      const school = await School.findById(id);

      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }

      // If email is being updated, ensure it's unique
      if (email && email !== school.email) {
        const existingSchool = await School.findOne({ email });
        if (existingSchool) {
          return res
            .status(400)
            .json({ error: "A school with this email already exists" });
        }
      }

      // Update the school fields
      school.name = name || school.name;
      school.address = address || school.address;
      school.phoneNumber = phoneNumber || school.phoneNumber;
      school.email = email || school.email;
      school.website = website || school.website;

      // Save the updated school to the database
      await school.save();

      // Send response
      res.status(200).json({
        message: "School updated successfully",
        school: {
          id: school._id,
          name: school.name,
          address: school.address,
          phoneNumber: school.phoneNumber,
          email: school.email,
          website: school.website,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Route to delete a school
router.delete("/schools/:id", async (req, res) => {
  const { id } = req.params; // Get the school ID from the URL parameter

  try {
    // Delete the school directly using findByIdAndDelete
    const school = await School.findByIdAndDelete(id);

    // If the school doesn't exist
    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    // Send success response
    res.status(200).json({
      message: "School deleted successfully",
      schoolId: id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
