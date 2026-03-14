import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
      required: true,
    },
    medicalForm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalForm",
      required: true
    },
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    medicalStatus: {
      type: String, 
      enum: ["waiting", "completed"], 
      default: "waiting"
    },
    meetingUrl: {
      type: String,
      default: "",
    },
    price: {
      type: Number, 
      required: true,
      default: 600000,
    }
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
