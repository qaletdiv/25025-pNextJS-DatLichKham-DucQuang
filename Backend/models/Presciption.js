import mongoose from "mongoose";


const prescriptionSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    AppointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    Note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
