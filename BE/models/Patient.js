import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["female", "male"],
      required: true,
      lowercase: true,
    },
    phone_number: {
      type: String,
      required: true,
      match: [/^(0|\+84)(\d{9})$/, "Phone number is invalid "],
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
