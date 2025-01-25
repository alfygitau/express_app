const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feeSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paymentDate: { type: Date },
    status: {
      type: String,
      enum: ["paid", "pending", "overdue"],
      default: "pending",
    },
    school: { type: Schema.Types.ObjectId, ref: "School", required: true },
    // Link to School
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", feeSchema);
