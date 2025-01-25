const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: true,
    },
    dateOfBirth: { type: Date },
    phoneNumber: { type: String },
    address: { type: String },
    school: { type: Schema.Types.ObjectId, ref: "School", required: true }, // Link to School
    class: { type: Schema.Types.ObjectId, ref: "Class" }, // Optional: Reference to class (for students)
  },
  { timestamps: true }
);

// Exclude password when converting to JSON (e.g., when sending data to the client)
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password; // Remove the password field from the returned object
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
