import mongoose from "mongoose";

const prescriptionDetailSchema = new mongoose.Schema(
  {
    prescriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      required: true,
    },
    pillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pill",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
