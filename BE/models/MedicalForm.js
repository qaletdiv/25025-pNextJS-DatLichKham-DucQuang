import mongoose from "mongoose";

const medicalFormSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    description: {
      type: String,
    },
    pastMedicalHistory: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    rejectedMessage: {
      type: String,
      default: null,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt tự động thêm vào
  }
);

const MedicalForm = mongoose.model("MedicalForm", medicalFormSchema);
export default MedicalForm;
