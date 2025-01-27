const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feeStructureSchema = new Schema(
  {
    school: { type: Schema.Types.ObjectId, ref: "School", required: true }, // Link to School
    academicYear: { type: String, required: true }, // Academic year for the fee structure (e.g., "2024")
    totalFee: { type: Number, required: true }, // Total fee for the academic year
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeeStructure", feeStructureSchema);
