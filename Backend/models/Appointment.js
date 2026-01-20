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
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "cancelled"],
      default: "pending",
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
