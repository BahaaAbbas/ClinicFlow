import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
    min: 0,
  },
  notes: {
    type: String,
    default: "",
  },
});

const visitSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    treatments: [treatmentSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
    medicalNotes: {
      type: String,
      default: "",
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

visitSchema.pre("save", function () {
  this.totalAmount = this.treatments.reduce(
    (sum, treat) => sum + treat.cost,
    0
  );
  return;
});

export default mongoose.model("Visit", visitSchema);
