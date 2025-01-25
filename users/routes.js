const express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("./User");
const School = require("../school/School");
const router = express.Router();
const generateTokens = require("../auth/utils/generateToken");

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["admin", "teacher", "student"])
      .withMessage("Role must be either admin, teacher, or student"),
    body("schoolId").notEmpty().withMessage("School ID is required"),
    body("dateOfBirth")
      .optional()
      .isDate()
      .withMessage("Please provide a valid date of birth"),
    body("phoneNumber").optional(),
    body("address")
      .optional()
      .isString()
      .withMessage("Please provide a valid address"),
    body("classId")
      .optional()
      .custom(async (value) => {
        if (value) {
          const classExists = await Class.findById(value);
          if (!classExists) {
            throw new Error("Class not found");
          }
        }
      })
      .withMessage("Please provide a valid class ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      password,
      role,
      schoolId,
      dateOfBirth,
      phoneNumber,
      address,
      classId,
    } = req.body;

    try {
      // Check if the school exists
      const school = await School.findById(schoolId);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }

      // Check if user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        school: schoolId,
        dateOfBirth,
        phoneNumber,
        address,
        class: classId, // Optionally assign class ID if provided
      });

      // Save user to the database
      await newUser.save();

      // Generate both tokens
      const { accessToken, refreshToken } = generateTokens(newUser);

      // Send response with user data and token
      res.status(201).json({
        message: "User created successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          dateOfBirth: newUser.dateOfBirth,
          phoneNumber: newUser.phoneNumber,
          address: newUser.address,
          class: newUser.class,
          created_at: newUser.createdAt,
          updated_at: newUser.updatedAt,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    // Fetch all users from the database and populate the `school` and `class` references
    const users = await User.find()
      .populate("school", "name") // Only populate the school name
      .populate("class", "name"); // Optionally populate the class name if the field is present

    // Return all users with populated data
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the user by ID and populate related fields (school and class)
    const user = await User.findById(id)
      .populate("school", "name")
      .populate("class", "name");

    // If user not found, return a 404 error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the found user with populated data
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a user by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    password,
    role,
    dateOfBirth,
    phoneNumber,
    address,
    classId,
    schoolId,
  } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the email has changed and if the new email is already in use
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: "Email is already in use" });
      }
    }

    // Hash the password if it's provided (to prevent overwriting with plain password)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Update the user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;
    user.class = classId || user.class; // Optional class update
    user.school = schoolId || user.school; // Optional school update

    // Save the updated user
    await user.save();

    // Return the updated user
    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        phoneNumber: user.phoneNumber,
        address: user.address,
        class: user.class,
        school: user.school,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID and remove
    const user = await User.findByIdAndDelete(id);

    // If user is not found, return 404
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return success message
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
