import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    medicines: [
      {
        pill: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Pill",
          required: true,
        },
        dosage: { type: String, required: true },
        quantity: { type: Number, required: true },
        instruction: { type: String, default: "" },
      },
    ],
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);
const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
